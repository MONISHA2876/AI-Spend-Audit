"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Audit() {
  type AuditData = {
    [key: string]: unknown;
  };

  const [formData, setFormData] = useState<AuditData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("audit-data");
    if (saved) {
      const data: AuditData = JSON.parse(saved);
      setFormData(data);
    }
  }, []);

  return (
    <div className="flex flex-col bg-black">
      <main className="flex-1 flex flex-col items-center justify-center text-center text-gray-300">
        {!formData ? (
          <>
            <Image
              src="/robot.png"
              alt="Audit Banner"
              width={400}
              height={400}
              className=" m-8 mb-4"
            />
            <p className="text-xl">
              Add tools to start auditing your AI spend!
            </p>
          </>
        ) : (
          <></>
        )}
        <button
          className="px-4 py-2
            m-8
            rounded-xl
            bg-white/20
            border border-white/30
            text-md font-light text-gray-200
            backdrop-blur-md
            hover:bg-yellow-500/50
            hover:text-white
            transition-all duration-300
            shadow-lg"
          onClick={() => alert("Add Tool functionality coming soon!")}
        >
          + Add Tool
        </button>
      </main>
    </div>
  );
}
