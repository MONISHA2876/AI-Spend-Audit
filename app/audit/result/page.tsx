"use client";

import { useRouter } from "next/navigation";
import HeroSection from "@/components/audit/HeroSection";
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
      router.push("/audit");
      return;
    }

    const formData: AuditData | null = savedForm ? JSON.parse(savedForm) : null;
    const globalUseCase = formData?.useCase || "";

    const result = auditTools(toolsArray, globalUseCase);
    setSummary(result);
  }, [router]);

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
            <p className="text-sm text-gray-300 mb-6">
              Based on your current AI tooling configuration
            </p>

            <HeroSection summary={summary} />
          </div>
        </div>
      </div>
    </div>
  );
}
