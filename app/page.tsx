"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-9xl font-bold">Find Hidden AI</h1>
        <h1 className="text-9xl font-bold">Subscription Waste</h1>
        <Link href="/audit" className="mt-8">
          <button
            className="px-4 py-2 mt-8 rounded-xl bg-white/20 border border-white/30
            text-md font-light text-gray-200 backdrop-blur-md hover:bg-yellow-500/50
            hover:text-white transition-all duration-300 shadow-lg"
          >
            Start Your Audit
          </button>
        </Link>
      </main>
    </div>
  );
}
