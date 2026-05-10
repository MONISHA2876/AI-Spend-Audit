"use client";

import { useRouter } from "next/navigation";
import HeroSection from "@/components/audit/HeroSection";
import AuditCard from "@/components/audit/AuditCard";
import AISummary from "@/components/audit/AISummary";
import { useEffect, useState } from "react";
import { auditTools } from "@/components/audit/AuditLogic";
import { AuditResult, AuditSummary, AuditData } from "@/constants/types";
import { ToolCardData } from "@/components/ToolCard";

export default function ResultPage() {
  const router = useRouter();
  const [summary, setSummary] = useState<AuditSummary | null>(null);

  useEffect(() => {
    const savedTools = localStorage.getItem("audit-tools");
    const savedForm = localStorage.getItem("audit-data");

    if (!savedTools) {
      router.push("/audit");
      return;
    }

    const toolsMap: Record<string, ToolCardData> = JSON.parse(savedTools);
    const toolsArray = Object.values(toolsMap);

    if (toolsArray.length === 0) {
      alert("Please add at least one tool to start."); //ye do baar kyu aa raha hai o_O
      router.push("/audit");
      return;
    }

    const formData: AuditData | null = savedForm ? JSON.parse(savedForm) : null;
    const globalUseCase = formData?.useCase || "";

    const result = auditTools(toolsArray, globalUseCase);
    setSummary(result);
  }, [router]);

  //handling fallback when user lands directly on result page without going through audit page
  if (!summary) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-gray-500 text-sm">Running audit...</p>
      </div>
    );
  }

  const isOptimized =
    summary.optimizationLevel === "optimized" ||
    summary.totalMonthlySavings < 100;

  return (
    <div className="min-h-screen bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <button
          onClick={() => router.push("/audit")}
          className="text-sm text-gray-500 hover:text-gray-400 transition-colors duration-150 mb-4 block"
        >
          ← Back to audit
        </button>

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 min-w-0">
            <h1 className="text-4xl font-bold text-white mb-1">
              Audit Results
            </h1>
            <p className="text-sm text-gray-500 mb-12">
              Based on your current AI tooling configuration
            </p>

            <HeroSection summary={summary} />

            {isOptimized ? (
              <div
                className="rounded-2xl border border-white/30 bg-white/5 p-6 mt-10 text-center transition-all duration-200
        hover:bg-white/9"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-emerald-400 text-lg">✓</span>
                </div>
                <p className="text-base font-semibold text-white mb-1">
                  No major cost inefficiencies detected
                </p>
                <p className="text-sm text-gray-400 leading-relaxed max-w-md mx-auto">
                  Your current AI tooling stack appears appropriately sized for
                  your workflow and team structure. No plan changes are
                  recommended at this time.
                </p>
              </div>
            ) : (
              <></>
            )}

            {summary.results.length > 0 && (
              <div>
                <p className="text-xs my-10  font-medium text-gray-500 uppercase tracking-widest mb-3 ">
                  Tool Breakdown — {summary.results.length} tool
                  {summary.results.length !== 1 ? "s" : ""} audited
                </p>
                <div className="grid grid-cols-1 xl:grid-cols-2 mt-4 gap-4">
                  {summary.results.map((result) => (
                    <AuditCard
                      key={`${result.toolName}-${result.currentPlan}`}
                      result={result}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="w-full lg:w-72 xl:w-80 shrink-0">
            <AISummary auditResults={summary.results} />
          </div>
        </div>
      </div>
    </div>
  );
}
