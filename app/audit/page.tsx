"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Form from "@/components/form";
import ToolCard, { ToolCardData } from "@/components/ToolCard";
import { AuditData } from "@/constants/types";
import { TOOL_NAMES, TOOL_CONFIG } from "@/constants/constants";
import Link from "next/link";

type ToolsMap = Record<string, ToolCardData>;

export default function Audit() {
  const [formData, setFormData] = useState<AuditData | null>(null);
  const [tools, setTools] = useState<ToolsMap>({});
  const [show, setShow] = useState(false);

  useEffect(() => {
    const savedForm = localStorage.getItem("audit-data");
    if (savedForm) setFormData(JSON.parse(savedForm));

    const savedTools = localStorage.getItem("audit-tools");
    if (savedTools) setTools(JSON.parse(savedTools));
  }, []);

  // Persist tools on every change
  useEffect(() => {
    localStorage.setItem("audit-tools", JSON.stringify(tools));
  }, [tools]);

  const handleAddTool = () => {
    const id = `tool-${Date.now()}`;
    const firstTool = TOOL_NAMES[0];
    const firstPlan = TOOL_CONFIG[firstTool].plans[0];
    setShow(true);
    setTools((prev) => ({
      ...prev,
      [id]: {
        id,
        toolName: firstTool,
        plan: firstPlan.label,
        monthlySpend: firstPlan.price,
        seats: 1,
      },
    }));
  };

  const handleRemoveTool = (id: string) => {
    setTools((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleToolChange = (data: ToolCardData) => {
    setTools((prev) => ({ ...prev, [data.id]: data }));
  };

  const toolList = Object.values(tools);
  const totalSpend = toolList.reduce(
    (sum, t) => sum + t.monthlySpend * t.seats,
    0,
  );

  return (
    <div className="flex flex-col bg-black ">
      <main className="flex-1 flex flex-col items-center text-center text-gray-300 pb-12">
        {/* (toolList.length > 0) ye bhi use kar sakte h yaha */}

        {!show ? (
          <div className="flex flex-col items-center justify-center mt-8">
            <Image
              src="/robot.png"
              alt="Audit Banner"
              width={400}
              height={400}
              className="m-8 mb-4"
            />
            <p className="text-xl">
              Add tools to start auditing your AI spend!
            </p>
          </div>
        ) : (
          <Form />
        )}

        <button
          className="px-4 py-2 m-8 rounded-xl bg-white/20 border border-white/30
            text-md font-light text-gray-200 backdrop-blur-md
            hover:bg-yellow-500/50 hover:text-white
            transition-all duration-300 shadow-lg"
          onClick={handleAddTool}
        >
          + Add Tool
        </button>

        {toolList.length > 0 && (
          <div className="w-full max-w-6xl px-4">
            <div className="flex flex-row items-center justify-center gap-6 flex-wrap">
              {toolList.map((tool) => (
                <ToolCard
                  key={tool.id}
                  id={tool.id}
                  initialData={tool}
                  onRemove={handleRemoveTool}
                  onChange={handleToolChange}
                />
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <div
                className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4
                backdrop-blur-md flex items-center gap-6"
              >
                <div className="text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Total Tools
                  </p>
                  <p className="text-xl font-bold text-white">
                    {toolList.length}
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-left">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Monthly Spend
                  </p>
                  <p className="text-xl font-bold text-yellow-400">
                    {totalSpend === 0
                      ? "—"
                      : `$${totalSpend.toFixed(2).replace(/\.00$/, "")}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        <Link href="/audit/result">
          <button
            className="px-4 py-2 m-8 rounded-xl bg-white/20 border border-white/30
            text-md font-light text-gray-200 backdrop-blur-md
            hover:bg-yellow-500/50 hover:text-white
            transition-all duration-300 shadow-lg"
          >
            Generate Audit Report
          </button>
        </Link>
      </main>
    </div>
  );
}
