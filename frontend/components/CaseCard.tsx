import Link from "next/link";
import type { CaseSpec } from "@/lib/api";

const CATEGORY_LABELS: Record<CaseSpec["category"], { label: string; className: string }> = {
  basic_flow: { label: "기본 유동", className: "border-sky-800 bg-sky-950/60 text-sky-300" },
  multiphase: { label: "다상 유동", className: "border-violet-800 bg-violet-950/60 text-violet-300" },
  thermal: { label: "열 유동", className: "border-amber-800 bg-amber-950/60 text-amber-300" },
};

export default function CaseCard({ caseSpec }: { caseSpec: CaseSpec }) {
  const cat = CATEGORY_LABELS[caseSpec.category];
  return (
    <Link
      href={`/gallery/${caseSpec.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-sky-700 hover:bg-zinc-900"
    >
      <div className="flex items-center gap-2">
        <span className={`rounded-full border px-2 py-0.5 text-[11px] ${cat.className}`}>
          {cat.label}
        </span>
        <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-400">
          {caseSpec.dimension}
        </span>
      </div>
      <h3 className="font-semibold text-zinc-100 group-hover:text-sky-300">
        {caseSpec.display_name}
      </h3>
      <p className="text-sm leading-6 text-zinc-400">{caseSpec.description}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
        {caseSpec.output_fields.map((f) => (
          <span
            key={f.name}
            className="rounded bg-zinc-800 px-1.5 py-0.5 text-[11px] text-zinc-400"
          >
            {f.label}
          </span>
        ))}
      </div>
    </Link>
  );
}
