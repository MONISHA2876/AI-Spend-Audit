"use client";

import { useState } from "react";

type FormData = {
  email: string;
  company: string;
  role: string;
  teamSize: string;
};

type FormStatus = "idle" | "submitted";

const TRUST_POINTS = [
  {
    icon: "→",
    text: "Identify overspend across your entire AI tool stack in minutes.",
  },
  {
    icon: "→",
    text: "Get plan-level recommendations backed by current vendor pricing.",
  },
  {
    icon: "→",
    text: "No integrations required — just your tool list.",
  },
];

const TEAM_SIZE_OPTIONS = [
  { value: "", label: "Select team size" },
  { value: "1", label: "Just me" },
  { value: "2-5", label: "2 – 5" },
  { value: "6-15", label: "6 – 15" },
  { value: "16-50", label: "16 – 50" },
  { value: "51-200", label: "51 – 200" },
  { value: "200+", label: "200+" },
];

const inputClass = `
  w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3
  text-sm text-gray-200 placeholder:text-gray-600
  focus:outline-none focus:border-yellow-500/40 focus:bg-[#111111]
  transition-all duration-200
`.trim();

const labelClass = "block text-xs font-medium text-gray-500 mb-2 tracking-wide";

export default function ContactPage() {
  const [form, setForm] = useState<FormData>({
    email: "",
    company: "",
    role: "",
    teamSize: "",
  });

  const [status, setStatus] = useState<FormStatus>("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Lead captured:", form);
    setStatus("submitted");
  };

  return (
    <div className=" bg-black text-gray-300 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-16 lg:gap-24 items-center lg:items-start">
        <div className="flex-1 max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            <span className="text-xs font-medium text-yellow-500 tracking-widest uppercase">
              AI Spend Audit
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold text-white leading-tight tracking-tight mb-5">
            Know exactly what
            <br />
            your AI stack costs.
          </h1>

          <p className="text-sm text-gray-500 leading-relaxed mb-10 max-w-sm">
            Most teams overpay for AI tools they underuse. Get a detailed audit
            of your current stack — with specific plan recommendations and
            estimated savings.
          </p>

          {/* Trust points */}
          <ul className="space-y-4">
            {TRUST_POINTS.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-yellow-500 text-xs mt-0.5 shrink-0 font-medium">
                  {point.icon}
                </span>
                <span className="text-sm text-gray-400 leading-relaxed">
                  {point.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Right: Form ── */}
        <div className="w-full lg:w-105 shrink-0">
          <div className="rounded-2xl border border-white/30 bg-[#0a0a0a] p-7 sm:p-8">
            {status === "submitted" ? (
              /* Success state */
              <div className="py-8 text-center">
                <div
                  className="w-10 h-10 rounded-full bg-yellow-400/10 border border-yellow-400/20
                  flex items-center justify-center mx-auto mb-5"
                >
                  <span className="text-yellow-400 text-base">✓</span>
                </div>
                <p className="text-base font-semibold text-white mb-2">
                  You are on the list.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We will send your full audit report to{" "}
                  <span className="text-gray-300">{form.email}</span>.
                </p>
                <button
                  onClick={() => {
                    setStatus("idle");
                    setForm({ email: "", company: "", role: "", teamSize: "" });
                  }}
                  className="mt-6 text-xs text-gray-600 hover:text-gray-400 transition-colors duration-150 underline underline-offset-2"
                >
                  Submit another
                </button>
              </div>
            ) : (
              /* Form */
              <>
                <div className="mb-7">
                  <h2 className="text-base font-semibold text-white mb-1">
                    Get your full audit report
                  </h2>
                  <p className="text-xs text-gray-600">
                    Free. No credit card required.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Work Email */}
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Work Email <span className="text-yellow-600">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className={inputClass}
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className={labelClass}>
                      Company Name
                    </label>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Acme Inc."
                      className={inputClass}
                    />
                  </div>

                  {/* Role */}
                  <div>
                    <label htmlFor="role" className={labelClass}>
                      Role / Job Title
                    </label>
                    <input
                      id="role"
                      name="role"
                      type="text"
                      value={form.role}
                      onChange={handleChange}
                      placeholder="Engineering Manager"
                      className={inputClass}
                    />
                  </div>

                  {/* Team Size */}
                  <div>
                    <label htmlFor="teamSize" className={labelClass}>
                      Team Size
                    </label>
                    <select
                      id="teamSize"
                      name="teamSize"
                      value={form.teamSize}
                      onChange={handleChange}
                      className={inputClass}
                    >
                      {TEAM_SIZE_OPTIONS.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className="bg-[#0f0f0f] text-gray-300"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-yellow-400 text-black
                      text-sm font-semibold tracking-wide
                      hover:bg-yellow-300 active:bg-yellow-500
                      transition-colors duration-200"
                  >
                    Get Full Audit Report
                  </button>

                  <p className="text-center text-xs text-gray-700 pt-1">
                    No spam. Unsubscribe at any time.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
