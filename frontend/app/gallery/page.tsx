"use client";

import { useEffect, useState } from "react";
import { getCases, type CaseSpec } from "@/lib/api";
import CaseCard from "@/components/CaseCard";

export default function GalleryPage() {
  const [cases, setCases] = useState<CaseSpec[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCases().then(setCases).catch((e) => setError(String(e)));
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">시뮬레이션 갤러리</h1>
        <p className="mt-2 text-sm text-zinc-400">
          케이스를 선택하면 파라미터를 조정해 즉시 실행할 수 있습니다.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
          백엔드에 연결할 수 없습니다. 서버(포트 8000)가 실행 중인지 확인하세요.
          <div className="mt-1 font-mono text-xs text-red-400">{error}</div>
        </div>
      )}

      {!cases && !error && (
        <div className="py-20 text-center text-zinc-500">케이스 목록 불러오는 중…</div>
      )}

      {cases && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <CaseCard key={c.id} caseSpec={c} />
          ))}
        </div>
      )}
    </div>
  );
}
