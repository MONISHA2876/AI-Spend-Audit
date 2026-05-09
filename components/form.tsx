"use client";

import { useState, useEffect } from "react";
import { AuditData } from "@/constants/types";

export default function Form() {
  const [teamSize, setTeamSize] = useState("");
  const [useCase, setUseCase] = useState("");

  // Reload par data load karo
  useEffect(() => {
    const saved = localStorage.getItem("audit-data");
    if (saved) {
      const data: AuditData = JSON.parse(saved);
      setTeamSize(data.teamSize || "");
      setUseCase(data.useCase || "");
    }
  }, []);

  const saveToLocalStorage = (newTeamSize: string, newUseCase: string) => {
    localStorage.setItem(
      "audit-data",
      JSON.stringify({ teamSize: newTeamSize, useCase: newUseCase }),
    );
  };

  const handleTeamSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeamSize(e.target.value);
    saveToLocalStorage(e.target.value, useCase);
  };

  const handleUseCaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUseCase(e.target.value);
    saveToLocalStorage(teamSize, e.target.value);
  };

  return (
    <div className="flex-1 flex flex-col text-center text-gray-300">
      <h1 className="text-4xl font-bold my-8">Your AI Stack</h1>
      <div className="flex flex-row gap-3 justify-center items-center mb-6">
        <p className="text-lg font-medium">Team Size</p>
        <input
          type="number"
          value={teamSize}
          onChange={handleTeamSizeChange}
          className="bg-gray-800 text-gray-300 rounded-md p-2 w-64"
        />
      </div>
      <div className="flex flex-row gap-3 justify-center items-center">
        <p className="text-lg font-medium">Primary Use Case</p>
        <select
          value={useCase}
          onChange={handleUseCaseChange}
          className="bg-gray-800 text-gray-300 rounded-md p-2 w-64"
        >
          <option value="">-- Select Use Case --</option>
          <option value="coding">Coding</option>
          <option value="writing">Writing</option>
          <option value="customer-support">Customer Support</option>
          <option value="data-analysis">Data Analysis</option>
          <option value="marketing">Marketing</option>
          <option value="other">Other</option>
        </select>
      </div>
    </div>
  );
}
