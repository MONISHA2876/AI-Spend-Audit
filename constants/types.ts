export type AuditData = {
  teamSize: string;
  useCase: string;
};

export type Plan = {
  label: string;
  price: number;
  note?: string;
};

export type ToolConfig = {
  plans: Plan[];
};

export type TeamType = "solo" | "small-team" | "mid-team" | "enterprise";

export type AuditPlanConfig = {
  monthlyPrice: number;
  recommendedMinSeats: number;
  recommendedMaxSeats: number;
  recommendedUseCases: string[];
  idealTeamTypes: TeamType[];
  enterpriseFocused: boolean;
  collaborationFocused: boolean;
  apiAvailable: boolean;
  creditEligible: boolean;
  cheaperInternalAlternative: string | null;
  alternativeTools: string[];
  reasoningNotes: string[];
};

export type AuditToolConfig = {
  plans: Record<string, AuditPlanConfig>;
};

export type UserTool = {
  id?: string;
  toolName: string;
  plan: string;
  monthlySpend: number;
  seats: number;
  useCase?: string;
};

export type Severity = "high" | "moderate" | "low" | "ok";
export type RecommendedAction =
  | "downgrade-plan"
  | "switch-tool"
  | "switch-to-api"
  | "reduce-seats"
  | "optimized";

export type AuditResult = {
  toolName: string;
  currentPlan: string;
  currentMonthlySpend: number;
  recommendedAction: RecommendedAction;
  recommendedPlan: string | null;
  estimatedMonthlySavings: number;
  estimatedAnnualSavings: number;
  severity: Severity;
  reasoning: string[];
  alternativeSuggestion: string | null;
};

export type OptimizationLevel = "high" | "moderate" | "optimized";

export type AuditSummary = {
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  optimizationLevel: OptimizationLevel;
  showCredexBanner: boolean;
  results: AuditResult[];
};
