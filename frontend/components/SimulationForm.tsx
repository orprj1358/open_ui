"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSimulation, type CaseSpec } from "@/lib/api";

export default function SimulationForm({ caseSpec }: { caseSpec: CaseSpec }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(caseSpec.parameters.map((p) => [p.name, p.default])),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const job = await createSimulation(caseSpec.id, values);
      router.push(`/simulate/${job.job_id}`);
    } catch (err) {
      setError(String(err));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {caseSpec.parameters.map((p) => (
        <div key={p.name} className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <label htmlFor={p.name} className="text-sm font-medium text-zinc-200">
              {p.label}
              {p.unit && <span className="ml-1 text-xs text-zinc-500">({p.unit})</span>}
            </label>
            <span className="font-mono text-sm text-sky-300">
              {values[p.name]}
            </span>
          </div>
          <input
            id={p.name}
            type="range"
            min={p.min}
            max={p.max}
            step={p.type === "int" ? 1 : (p.max - p.min) / 100}
            value={values[p.name]}
            onChange={(e) =>
              setValues((v) => ({ ...v, [p.name]: Number(e.target.value) }))
            }
            className="accent-sky-500"
          />
          <div className="flex justify-between text-[11px] text-zinc-500">
            <span>{p.min}</span>
            <span className="font-mono">{p.name}</span>
            <span>{p.max}</span>
          </div>
        </div>
      ))}

      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950/50 p-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-sky-500 px-5 py-2.5 font-medium text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "제출 중…" : "시뮬레이션 실행"}
      </button>
    </form>
  );
}
