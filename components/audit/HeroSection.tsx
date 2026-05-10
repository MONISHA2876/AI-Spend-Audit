import { AuditSummary } from "@/constants/types";

export default function HeroSection({ summary }: { summary: AuditSummary }) {
  const isOptimized = summary.optimizationLevel === "optimized";
  const statusLabel =
    summary.optimizationLevel === "high"
      ? "High Savings Detected"
      : summary.optimizationLevel === "moderate"
        ? "Moderately Optimized Stack"
        : "Well Optimized Stack";

  return (
    <div className="rounded-2xl border border-white/30 bg-white/5 p-6 mb-6">
      <p className="text-sm font-medium text-gray-300 uppercase tracking-widest mb-4">
        Audit Summary
      </p>

      <div className="flex flex-col sm:flex-row gap-6">
        {/* Monthly savings */}
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">
            Potential Monthly Savings
          </p>
          <p
            className={`text-4xl font-bold tracking-tight ${
              isOptimized ? "text-gray-400" : "text-yellow-400"
            }`}
          >
            {isOptimized ? "-" : `$${summary.totalMonthlySavings.toFixed(0)}`}
          </p>
        </div>

        <div className="w-px bg-white/10 hidden sm:block" />

        {/* Annual savings */}
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Potential Annual Savings</p>
          <p
            className={`text-4xl font-bold tracking-tight ${
              isOptimized ? "text-gray-400" : "text-white"
            }`}
          >
            {isOptimized ? "-" : `$${summary.totalAnnualSavings.toFixed(0)}`}
          </p>
        </div>

        <div className="w-px bg-white/10 hidden sm:block" />

        {/* Status */}
        <div className="flex-1">
          <p className="text-xs text-gray-500 mb-1">Optimization Status</p>
          <p
            className={`text-lg font-semibold ${
              isOptimized
                ? "text-emerald-400"
                : summary.optimizationLevel === "high"
                  ? "text-yellow-400"
                  : "text-blue-400"
            }`}
          >
            {statusLabel}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Total monthly spend: ${summary.totalMonthlySpend.toFixed(0)}
          </p>
        </div>
      </div>
    </div>
  );
}
