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

function TeamSize(seats: number): TeamType {
  if (seats === 1) return "solo";
  if (seats > 1 && seats <= 5) return "small-team";
  if (seats > 5 && seats <= 20) return "mid-team";
  return "enterprise";
}

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
