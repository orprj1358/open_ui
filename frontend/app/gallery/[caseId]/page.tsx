"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { getCase, type CaseSpec } from "@/lib/api";
import SimulationForm from "@/components/SimulationForm";

export default function CaseDetailPage({
  params,
}: {
  params: Promise<{ caseId: string }>;
}) {
  const { caseId } = use(params);
  const [caseSpec, setCaseSpec] = useState<CaseSpec | null | undefined>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCase(caseId).then(setCaseSpec).catch((e) => setError(String(e)));
  }, [caseId]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
        {error}
      </div>
    );
  }
  if (caseSpec === null) {
    return <div className="py-20 text-center text-zinc-500">불러오는 중…</div>;
  }
  if (caseSpec === undefined) {
    return (
      <div className="py-20 text-center text-zinc-400">
        존재하지 않는 케이스입니다.{" "}
        <Link href="/gallery" className="text-sky-400 underline">
          갤러리로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      <div>
        <Link href="/gallery" className="text-sm text-zinc-500 hover:text-zinc-300">
          ← 갤러리
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight">
          {caseSpec.display_name}
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{caseSpec.description}</p>
        <div className="mt-3 flex gap-2 text-[11px]">
          <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-zinc-400">
            {caseSpec.dimension}
          </span>
          <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-zinc-400">
            출력: {caseSpec.output_fields.map((f) => f.label).join(", ")}
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-zinc-400">
          파라미터
        </h2>
        <SimulationForm caseSpec={caseSpec} />
      </div>
    </div>
  );
}
