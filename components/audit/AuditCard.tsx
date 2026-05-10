"use client";

import { useState } from "react";
import { AuditResult } from "@/constants/types";
import { severityConfig } from "@/constants/constants";
import { actionLabel } from "@/constants/constants";

export default function AuditCard({ result }: { result: AuditResult }) {
  const [expanded, setExpanded] = useState(false);
  const sev = severityConfig[result.severity];

  return (
    <div
      className={`rounded-2xl border bg-white/5 p-5 transition-all duration-200
        hover:bg-white/9 ${sev.border}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${sev.dot}`} />
            <p className="text-sm font-semibold text-white">
              {result.toolName}
            </p>
          </div>
          <p className="text-xs text-gray-500 pl-4">{result.currentPlan}</p>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-md border shrink-0
            ${
              result.severity === "ok"
                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                : result.severity === "high"
                  ? "text-red-400 bg-red-500/10 border-red-500/20"
                  : result.severity === "moderate"
                    ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
                    : "text-blue-400 bg-blue-500/10 border-blue-500/20"
            }`}
        >
          {sev.label}
        </span>
      </div>

      <div className="flex gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Current Spend</p>
          <p className="text-sm font-medium text-white">
            ${result.currentMonthlySpend.toFixed(0)}/mo
          </p>
        </div>
        {result.estimatedMonthlySavings > 0 && (
          <>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-xs text-gray-500">Est. Monthly Savings</p>
              <p className="text-sm font-semibold text-yellow-400">
                ${result.estimatedMonthlySavings.toFixed(0)}/mo
              </p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-xs text-gray-500">Est. Annual Savings</p>
              <p className="text-sm font-medium text-white">
                ${result.estimatedAnnualSavings.toFixed(0)}/yr
              </p>
            </div>
          </>
        )}
      </div>

      <div className="bg-white/5 rounded-xl px-4 py-3 mb-3 border border-white/5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Recommended Action</p>
            <p className="text-sm font-medium text-white">
              {actionLabel[result.recommendedAction]}
              {result.recommendedPlan && (
                <span className="text-yellow-400">
                  {" "}
                  → {result.recommendedPlan}
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {result.reasoning.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 leading-relaxed">
            {result.reasoning[0]}
          </p>
          {result.reasoning.length > 1 && (
            <>
              {expanded && (
                <div className="mt-2 space-y-2">
                  {result.reasoning.slice(1).map((r, i) => (
                    <p
                      key={i}
                      className="text-xs text-gray-500 leading-relaxed"
                    >
                      {r}
                    </p>
                  ))}
                </div>
              )}
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-xs text-gray-600 hover:text-gray-400 transition-colors duration-150"
              >
                {expanded
                  ? "Show less ↑"
                  : `+${result.reasoning.length - 1} more`}
              </button>
            </>
          )}
        </div>
      )}

      {result.alternativeSuggestion && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-xs text-gray-500 mb-1">Alternative</p>
          <p className="text-xs text-blue-400 leading-relaxed">
            {result.alternativeSuggestion}
          </p>
        </div>
      )}
    </div>
  );
}
