"use client";

import { useState, useEffect, useCallback } from "react";
import { AuditResult } from "@/constants/types";

type Props = {
  auditResults: AuditResult[];
};

export default function AISummary({ auditResults }: Props) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Wrap in useCallback so it doesn't recreate on every render
  const generateSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const response = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditResults }),
      });

      const data = await response.json();

      if (data.success) {
        setSummary(data.summary);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [auditResults]);

  useEffect(() => {
    // Now it will trigger if auditResults populate after initial mount
    if (auditResults?.length > 0) {
      generateSummary();
    }
  }, [auditResults, generateSummary]); // Added dependencies

  return (
    <div
      className="sticky top-6 rounded-2xl border border-white/30 transition-all duration-200
        hover:bg-white/9 bg-white/5 p-5 h-fit"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className={`w-2 h-2 rounded-full ${
            loading ? "bg-yellow-400 animate-pulse" : "bg-yellow-400"
          }`}
        />
        <p className="text-sm font-semibold text-white">AI Summary</p>
        {loading && (
          <span className="ml-auto text-xs text-gray-500">Generating...</span>
        )}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          {[80, 60, 90, 50, 70].map((w, i) => (
            <div
              key={i}
              className="h-3 rounded-full bg-white/10"
              style={{ width: `${w}%` }}
            />
          ))}
          <div className="pt-3 border-t border-white/10 space-y-3">
            {[70, 85, 55].map((w, i) => (
              <div
                key={i}
                className="h-3 rounded-full bg-white/10"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Summary text */}
      {!loading && summary && (
        <div className="space-y-3">
          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
            {summary}
          </p>
          <button
            onClick={generateSummary}
            className="text-xs text-gray-600 hover:text-gray-400 transition-colors duration-150 mt-2"
          >
            ↻ Regenerate
          </button>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="text-center py-4">
          <p className="text-xs text-gray-500 mb-3">
            Could not generate summary.
          </p>
          <button
            onClick={generateSummary}
            className="text-xs text-yellow-500 hover:text-yellow-400 transition-colors duration-150 underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state — no results yet */}
      {!loading && !summary && !error && (
        <p className="text-xs text-gray-600 text-center py-4">
          Add tools to your audit to generate a summary.
        </p>
      )}
    </div>
  );
}
