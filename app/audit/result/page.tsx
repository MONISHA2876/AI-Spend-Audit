"use client";

import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
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
          </div>
        </div>
      </div>
    </div>
  );
}
