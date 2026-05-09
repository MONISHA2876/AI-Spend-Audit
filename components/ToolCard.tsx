"use client";

import { useEffect, useState } from "react";
import { TOOL_CONFIG, TOOL_NAMES } from "@/constants/constants";

export type ToolCardData = {
  id: string;
  toolName: string;
  plan: string;
  monthlySpend: number;
  seats: number;
};

type Props = {
  id: string;
  onRemove: (id: string) => void;
  onChange: (data: ToolCardData) => void;
  initialData?: ToolCardData;
};

export default function ToolCard({
  id,
  onRemove,
  onChange,
  initialData,
}: Props) {
  const [toolName, setToolName] = useState(
    initialData?.toolName || TOOL_NAMES[0],
  );
  const [plan, setPlan] = useState(initialData?.plan || "");
  const [seats, setSeats] = useState(initialData?.seats || 1);
  const [visible, setVisible] = useState(false);

  //animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const plans = TOOL_CONFIG[toolName]?.plans || [];

  //will reset the plan to first option when tool changes, because different tools have different plans
  useEffect(() => {
    const firstPlan = TOOL_CONFIG[toolName]?.plans[0]?.label || "";
    setPlan(firstPlan);
  }, [toolName]);

  const selectedPlan = TOOL_CONFIG[toolName]?.plans.find(
    (p) => p.label === plan,
  );
  const monthlySpend = selectedPlan?.price ?? 0;
  const isCustom =
    selectedPlan?.note === "Custom" || selectedPlan?.note === "Pay per token";
  const isPerSeat = selectedPlan?.note?.includes("/seat");

  //notify audit page about any change in the tool card data
  useEffect(() => {
    onChange({ id, toolName, plan, monthlySpend, seats });
  }, [toolName, plan, seats, monthlySpend]);

  const handleRemove = () => {
    setVisible(false);
    setTimeout(() => onRemove(id), 300);
  };

  const selectClass =
    "w-full bg-gray-900 text-gray-300 border border-white/10 rounded-lg px-3 py-2 " +
    "text-sm focus:outline-none focus:border-yellow-500/50 transition-colors duration-200";

  const spendDisplay = () => {
    if (isCustom) return selectedPlan?.note ?? "Custom";
    if (monthlySpend === 0) return "Free";
    if (isPerSeat) return `$${monthlySpend}/seat`;
    return `$${monthlySpend}/mo`;
  };

  const totalDisplay = () => {
    if (isCustom) return "—";
    if (monthlySpend === 0) return "Free";
    return `$${(monthlySpend * seats).toFixed(2).replace(/\.00$/, "")}`;
  };

  return (
    <div
      className={`
        relative flex flex-col gap-4 p-5
        bg-white/10 border border-white/30
        rounded-2xl shadow-lg backdrop-blur-md
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
      `}
    >
      {/* first tool is selected by default */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-white uppercase tracking-wider">
          Tool Name
        </label>
        <select
          value={toolName}
          onChange={(e) => setToolName(e.target.value)}
          className={selectClass}
        >
          {TOOL_NAMES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* plans are determined by the selected tool */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-white uppercase tracking-wider">
          Plan
        </label>
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className={selectClass}
        >
          {plans.map((p) => (
            <option key={p.label} value={p.label}>
              {p.label}
              {p.note ? ` (${p.note})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* We can not edit monthly spend it is determined by the selected plan */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-white uppercase tracking-wider">
          Monthly Spend
        </label>
        <div
          className={`w-full bg-gray-900/50 border border-white/5 rounded-lg px-3 py-2
            text-sm font-semibold tracking-wide cursor-not-allowed
            ${isCustom ? "text-gray-400 italic" : "text-yellow-400"}`}
        >
          {spendDisplay()}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-white uppercase tracking-wider">
          Seats
        </label>
        <input
          type="number"
          min={1}
          value={seats}
          onChange={(e) => setSeats(Math.max(1, Number(e.target.value)))}
          className={selectClass}
        />
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-white/10">
        <span className="text-xs text-white">Total / month</span>
        <span className="text-base font-bold text-white">{totalDisplay()}</span>
      </div>

      <button
        onClick={handleRemove}
        className="absolute top-3 right-3 text-gray-600 hover:text-red-400
          transition-colors duration-200 text-lg leading-none"
        aria-label="Remove tool"
      >
        ✕
      </button>
    </div>
  );
}
