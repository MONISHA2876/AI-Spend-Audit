import { AUDIT_TOOL_CONFIG } from "@/constants/constants";
import {
  AuditPlanConfig,
  AuditResult,
  AuditSummary,
  OptimizationLevel,
  RecommendedAction,
  Severity,
  TeamType,
  UserTool,
} from "@/constants/types";

//classify team on basis of seats
function TeamSize(seats: number): TeamType {
  if (seats === 1) return "solo";
  if (seats > 1 && seats <= 5) return "small-team";
  if (seats > 5 && seats <= 20) return "mid-team";
  return "enterprise";
}

//determine severrity and optimization level based on savings amount
function determineSeverity(savings: number): Severity {
  if (savings >= 100) return "high";
  if (savings >= 50) return "moderate";
  if (savings > 0) return "low";
  return "ok";
}
function determineOptimizationLevel(savings: number): OptimizationLevel {
  if (savings >= 100) return "high";
  if (savings >= 50) return "moderate";
  return "optimized";
}

function findCheaperSameVendorPlan(
  toolName: string,
  currentPlanName: string,
  currentPricePerSeat: number,
  seats: number,
  useCase: string,
): { planName: string; pricePerSeat: number } | null {
  const toolConfig = AUDIT_TOOL_CONFIG[toolName];
  if (!toolConfig) return null;

  let bestPlan: { planName: string; pricePerSeat: number } | null = null;

  for (const [planName, plan] of Object.entries(toolConfig.plans)) {
    if (planName === currentPlanName) continue;
    if (plan.monthlyPrice >= currentPricePerSeat) continue;
    if (seats < plan.recommendedMinSeats || seats > plan.recommendedMaxSeats)
      continue;
    if (useCase && !plan.recommendedUseCases.includes(useCase)) continue;

    // Take the cheapest valid option
    if (!bestPlan || plan.monthlyPrice < bestPlan.pricePerSeat) {
      bestPlan = { planName, pricePerSeat: plan.monthlyPrice };
    }
  }

  return bestPlan;
}

//Per-tool audit checks

//CHECK 1 - plan overkill: enterprise or high-tier plan for a small team. returns reason if overkill detected, else return empty array

function checkPlanOverkill(
  planConfig: AuditPlanConfig,
  seats: number,
  teamType: TeamType,
): string[] {
  const reasoning: string[] = [];

  if (
    planConfig.enterpriseFocused &&
    (teamType === "solo" || teamType === "small-team")
  ) {
    reasoning.push(
      "Enterprise-tier plans are structurally designed for organizations with compliance, " +
        "SSO, and centralized governance requirements. These features are unlikely to deliver " +
        `meaningful value for a ${seats}-seat team.`,
    );
  }

  if (seats < planConfig.recommendedMinSeats) {
    reasoning.push(
      `This plan is optimised for a minimum of ${planConfig.recommendedMinSeats} seats. ` +
        `At ${seats} seat(s), per-seat cost efficiency is lower than on a smaller-tier plan.`,
    );
  }

  if (seats > planConfig.recommendedMaxSeats && !planConfig.enterpriseFocused) {
    reasoning.push(
      `This plan is optimised for up to ${planConfig.recommendedMaxSeats} seats. ` +
        `At ${seats} seats, an enterprise or team plan may offer better commercial terms.`,
    );
  }

  return reasoning;
}

//CHECK 2 - Resturns a recommendation obj if a cheaper valid plan(of same vender) is found

function checkCheaperInternalPlan(
  toolName: string,
  currentPlan: string,
  currentPricePerSeat: number,
  seats: number,
  useCase: string,
  planConfig: AuditPlanConfig,
): {
  action: RecommendedAction;
  recommendedPlan: string;
  monthlySavings: number;
  reasoning: string[];
} | null {
  // Prefer the metadata hint first for speed; fall back to full scan
  const hintPlan = planConfig.cheaperInternalAlternative;
  let cheaper = findCheaperSameVendorPlan(
    toolName,
    currentPlan,
    currentPricePerSeat,
    seats,
    useCase,
  );

  // If the hint plan was explicitly set but our scanner excluded it (e.g. seat range mismatch), still surface it with a caveat — the metadata author knows the product best.

  if (!cheaper && hintPlan) {
    const hintConfig = AUDIT_TOOL_CONFIG[toolName]?.plans[hintPlan];
    if (hintConfig && hintConfig.monthlyPrice < currentPricePerSeat) {
      cheaper = { planName: hintPlan, pricePerSeat: hintConfig.monthlyPrice };
    }
  }

  if (!cheaper) return null;

  const monthlySavings = (currentPricePerSeat - cheaper.pricePerSeat) * seats;
  if (monthlySavings <= 0) return null;

  const reasoning = [
    `${toolName} ${cheaper.planName} is priced at $${cheaper.pricePerSeat}/seat/month, ` +
      `compared to $${currentPricePerSeat}/seat/month on the current ${currentPlan} plan.`,
    `For a ${seats}-seat team, this represents a potential saving of ` +
      `$${monthlySavings.toFixed(0)}/month ($${(monthlySavings * 12).toFixed(0)}/year) ` +
      `without a change in tooling vendor.`,
  ];

  // Pull in plan-level reasoning notes for additional context
  const cheaperPlanConfig =
    AUDIT_TOOL_CONFIG[toolName]?.plans[cheaper.planName];
  if (cheaperPlanConfig?.reasoningNotes?.length) {
    reasoning.push(...cheaperPlanConfig.reasoningNotes.slice(0, 2));
  }

  return {
    action: "downgrade-plan",
    recommendedPlan: cheaper.planName,
    monthlySavings,
    reasoning,
  };
}

//CHECK 3 - API/credit optimisation opportunity. Flag when a fixed price plan is used for workloads that may be more cost-eff on usage-based billing.
function checkApiOptimisation(
  toolName: string,
  planConfig: AuditPlanConfig,
  seats: number,
  monthlySpend: number,
): string[] {
  if (!planConfig.creditEligible) return [];

  const reasoning: string[] = [];

  if (monthlySpend > 100 * seats) {
    reasoning.push(
      `At $${monthlySpend}/month, it is worth modelling whether usage-based API billing ` +
        `would reduce total cost — particularly if workloads are bursty or variable rather ` +
        `than consistently high-volume.`,
    );
  }

  if (planConfig.apiAvailable) {
    reasoning.push(
      `${toolName} exposes an API with pay-per-token pricing. Teams running programmatic ` +
        `or batch workloads should compare projected API costs against the current flat-rate plan.`,
    );
  }

  return reasoning;
}

//CHECK-4 - cheaper alternative tool recommendation. Only surfaces a suggestion when use-case alignment is confirmed and meaningful savings exist.

function checkAlternativeTool(
  planConfig: AuditPlanConfig,
  useCase: string,
  currentMonthlySpend: number,
): string | null {
  if (!planConfig.alternativeTools.length) return null;

  // Find the first alternative whose plan config covers the same use case
  for (const altString of planConfig.alternativeTools) {
    const [altTool, altPlanHint] = altString.split(" ").reduce(
      (acc: [string, string], word, i, arr) => {
        // e.g. "GitHub Copilot Pro" → tool="GitHub Copilot", plan="Pro"
        if (AUDIT_TOOL_CONFIG[arr.slice(0, i + 1).join(" ")]) {
          return [arr.slice(0, i + 1).join(" "), arr.slice(i + 1).join(" ")];
        }
        return acc;
      },
      [altString, ""],
    );

    const altConfig = AUDIT_TOOL_CONFIG[altTool];
    if (!altConfig) continue;

    // Find a plan in the alternative tool that fits the use case
    for (const [planName, plan] of Object.entries(altConfig.plans)) {
      const targetPlan = altPlanHint ? planName === altPlanHint : true;
      if (!targetPlan) continue;
      if (useCase && !plan.recommendedUseCases.includes(useCase)) continue;

      // Only recommend if it's cheaper per-seat
      if (plan.monthlyPrice < currentMonthlySpend) {
        return (
          `${altTool} — ${planName} plan ($${plan.monthlyPrice}/seat/month) covers ` +
          `similar ${useCase} workflows at a lower price point.`
        );
      }
    }
  }

  return null;
}

// _________________________________________________________________________________
//                              MAIN AUDIT FUNCTION
// _________________________________________________________________________________

/**
 * auditTools — evaluates an array of user tool configurations and returns
 * a structured AuditSummary ready to power the results page.
 *
 * @param userTools   Array of tools entered by the user on the audit form.
 * @param globalUseCase  Optional: use case from the global Form component, used as a fallback when a tool has no per-tool use case.
 */
export function auditTools(
  userTools: UserTool[],
  globalUseCase = "",
): AuditSummary {
  const results: AuditResult[] = [];
  let totalMonthlySpend = 0;
  let totalMonthlySavings = 0;

  for (const tool of userTools) {
    const { toolName, plan: currentPlan, seats, monthlySpend } = tool;
    const useCase = tool.useCase || globalUseCase;
    const pricePerSeat = seats > 0 ? monthlySpend / seats : monthlySpend;

    totalMonthlySpend += monthlySpend;

    const toolConfig = AUDIT_TOOL_CONFIG[toolName];

    // If we have no audit config for this tool, return a neutral result
    if (!toolConfig) {
      results.push({
        toolName,
        currentPlan,
        currentMonthlySpend: monthlySpend,
        recommendedAction: "optimized",
        recommendedPlan: null,
        estimatedMonthlySavings: 0,
        estimatedAnnualSavings: 0,
        severity: "ok",
        reasoning: [
          "Insufficient pricing metadata available for this tool — manual review recommended.",
        ],
        alternativeSuggestion: null,
      });
      continue;
    }

    const planConfig = toolConfig.plans[currentPlan];

    // Plan not found in audit config - surface as neutral
    if (!planConfig) {
      results.push({
        toolName,
        currentPlan,
        currentMonthlySpend: monthlySpend,
        recommendedAction: "optimized",
        recommendedPlan: null,
        estimatedMonthlySavings: 0,
        estimatedAnnualSavings: 0,
        severity: "ok",
        reasoning: [
          `Plan "${currentPlan}" was not found in the audit configuration. ` +
            "Please verify the plan selection and re-run the audit.",
        ],
        alternativeSuggestion: null,
      });
      continue;
    }

    const teamType = TeamSize(seats);
    const allReasoning: string[] = [];
    let recommendedAction: RecommendedAction = "optimized";
    let recommendedPlan: string | null = null;
    let estimatedMonthlySavings = 0;

    //Check 1: Plan overkill
    const overkillReasons = checkPlanOverkill(planConfig, seats, teamType);
    if (overkillReasons.length) allReasoning.push(...overkillReasons);

    //Check 2: Cheaper same-vendor plan
    const internalRecommendation = checkCheaperInternalPlan(
      toolName,
      currentPlan,
      pricePerSeat,
      seats,
      useCase,
      planConfig,
    );

    if (internalRecommendation) {
      recommendedAction = internalRecommendation.action;
      recommendedPlan = internalRecommendation.recommendedPlan;
      estimatedMonthlySavings = internalRecommendation.monthlySavings;
      allReasoning.push(...internalRecommendation.reasoning);
    }

    //Check 3: API / credit optimisation
    const apiReasons = checkApiOptimisation(
      toolName,
      planConfig,
      seats,
      monthlySpend,
    );
    if (apiReasons.length) {
      allReasoning.push(...apiReasons);
      if (recommendedAction === "optimized")
        recommendedAction = "switch-to-api";
    }

    //Check 4: Alternative tool suggestion
    const altSuggestion = checkAlternativeTool(
      planConfig,
      useCase,
      pricePerSeat,
    );

    // If no issues found, surface positive confirmation
    if (allReasoning.length === 0) {
      allReasoning.push(
        `${toolName} ${currentPlan} appears appropriately sized for a ${seats}-seat ` +
          `${teamType.replace("-", " ")} with a ${useCase || "general"} workflow. ` +
          "No cost optimisation actions are recommended at this time.",
      );
      // Include any vendor-provided reasoning notes as supporting context
      if (planConfig.reasoningNotes.length) {
        allReasoning.push(...planConfig.reasoningNotes.slice(0, 1));
      }
    }

    totalMonthlySavings += estimatedMonthlySavings;

    results.push({
      toolName,
      currentPlan,
      currentMonthlySpend: monthlySpend,
      recommendedAction,
      recommendedPlan,
      estimatedMonthlySavings: parseFloat(estimatedMonthlySavings.toFixed(2)),
      estimatedAnnualSavings: parseFloat(
        (estimatedMonthlySavings * 12).toFixed(2),
      ),
      severity: determineSeverity(estimatedMonthlySavings),
      reasoning: allReasoning,
      alternativeSuggestion: altSuggestion,
    });
  }

  // Sort results: highest savings first so the results page leads with impact
  results.sort((a, b) => b.estimatedMonthlySavings - a.estimatedMonthlySavings);

  const level = determineOptimizationLevel(totalMonthlySavings);

  return {
    totalMonthlySpend: parseFloat(totalMonthlySpend.toFixed(2)),
    totalMonthlySavings: parseFloat(totalMonthlySavings.toFixed(2)),
    totalAnnualSavings: parseFloat((totalMonthlySavings * 12).toFixed(2)),
    optimizationLevel: level,
    showCredexBanner: totalMonthlySavings > 500,
    results,
  };
}
