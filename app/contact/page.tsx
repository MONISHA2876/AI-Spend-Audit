"use client";

import { useState } from "react";
import supabase from "@/lib/supabase";

type FormData = {
  email: string;
  company: string;
  role: string;
  teamSize: string;
};

type FormStatus = "idle" | "loading" | "submitted" | "error";

const TRUST_POINTS = [
  {
    icon: "→",
    text: "Identify overspend across your entire AI tool stack in minutes.",
  },
  {
    icon: "→",
    text: "Get plan-level recommendations backed by current vendor pricing.",
  },
  { icon: "→", text: "No integrations required — just your tool list." },
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

const EMPTY_FORM: FormData = { email: "", company: "", role: "", teamSize: "" };

const inputClass = [
  "w-full bg-[#0f0f0f] border border-white/10 rounded-xl px-4 py-3",
  "text-sm text-gray-200 placeholder:text-gray-600",
  "focus:outline-none focus:border-yellow-500/40 focus:bg-[#111111]",
  "transition-all duration-200",
].join(" ");

const labelClass = "block text-xs font-medium text-gray-500 mb-2 tracking-wide";

export default function ContactPage() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState(""); // ← fix: alag state
  const [honeypot, setHoneypot] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) return;

    if (!form.email.trim()) {
      setErrorMsg("Work email is required.");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const payload = {
        email: form.email.trim().toLowerCase(),
        company: form.company.trim() || null,
        role: form.role.trim() || null,
        team_size: form.teamSize || null,
      };

      const { data, error } = await supabase
        .from("leads")
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      console.log("Lead inserted:", data);

      setSubmittedEmail(form.email.trim().toLowerCase()); // ← save before reset
      setStatus("submitted");
      setForm(EMPTY_FORM);
    } catch (err: unknown) {
      console.error("Supabase insert error:", err);
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div className="bg-black text-gray-300 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-16 lg:gap-24 items-center lg:items-start">
        {/* ── Left ── */}
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

        {/* ── Right: Form card ── */}
        <div className="w-full lg:w-[420px] shrink-0">
          <div className="rounded-2xl border border-white/10 bg-[#0a0a0a] p-7 sm:p-8">
            {status === "submitted" ? (
              <div className="py-8 text-center">
                <div className="w-10 h-10 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mx-auto mb-5">
                  <span className="text-yellow-400 text-base">✓</span>
                </div>
                <p className="text-base font-semibold text-white mb-2">
                  You are on the list.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We will be in touch at{" "}
                  <span className="text-gray-300">{submittedEmail}</span>.
                  {/* ↑ form.email ki jagah submittedEmail use kiya */}
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-xs text-gray-600 hover:text-gray-400 transition-colors duration-150 underline underline-offset-2"
                >
                  Submit another
                </button>
              </div>
            ) : (
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
                  {/* Honeypot */}
                  <div aria-hidden="true" className="hidden">
                    <input
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

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

                  {status === "error" && errorMsg && (
                    <p className="text-xs text-red-400 leading-relaxed">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-yellow-400 text-black
                      text-sm font-semibold tracking-wide
                      hover:bg-yellow-300 active:bg-yellow-500
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {status === "loading" ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Get Full Audit Report"
                    )}
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
