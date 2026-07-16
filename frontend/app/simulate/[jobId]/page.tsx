"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import {
  getSimulation,
  getSimulationFrames,
  type FrameSet,
  type SimulationJob,
} from "@/lib/api";
import ResultPlayer from "@/components/ResultPlayer";

const STATUS_LABELS: Record<SimulationJob["status"], string> = {
  queued: "대기 중",
  running: "실행 중",
  done: "완료",
  failed: "실패",
};

export default function SimulateJobPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const [job, setJob] = useState<SimulationJob | null>(null);
  const [frameSets, setFrameSets] = useState<FrameSet[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const poll = async () => {
      try {
        const j = await getSimulation(jobId);
        if (stopped) return;
        setJob(j);
        if (j.status === "done") {
          const frames = await getSimulationFrames(jobId);
          if (!stopped) setFrameSets(frames);
        } else if (j.status !== "failed") {
          timer = setTimeout(poll, 1500);
        }
      } catch (e) {
        if (!stopped) setError(String(e));
      }
    };
    poll();
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
    };
  }, [jobId]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-bold tracking-tight">시뮬레이션 결과</h1>
        <Link href="/gallery" className="text-sm text-zinc-500 hover:text-zinc-300">
          ← 갤러리
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-900 bg-red-950/50 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {job && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  job.status === "done"
                    ? "bg-emerald-400"
                    : job.status === "failed"
                      ? "bg-red-400"
                      : "animate-pulse bg-sky-400"
                }`}
              />
              <span className="font-medium">{STATUS_LABELS[job.status]}</span>
              <span className="font-mono text-xs text-zinc-500">
                {job.case_id} · {job.job_id}
              </span>
            </div>
            <span className="font-mono text-xs text-zinc-400">
              {Math.round(job.progress * 100)}%
            </span>
          </div>

          {(job.status === "queued" || job.status === "running") && (
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-sky-500 transition-all duration-700"
                style={{ width: `${Math.max(5, job.progress * 100)}%` }}
              />
            </div>
          )}

          {job.status === "failed" && job.error && (
            <pre className="mt-4 overflow-x-auto rounded-lg bg-zinc-950 p-3 text-xs text-red-300">
              {job.error}
            </pre>
          )}

          {Object.keys(job.parameters).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(job.parameters).map(([k, v]) => (
                <span
                  key={k}
                  className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[11px] text-zinc-400"
                >
                  {k}={v}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {!job && !error && (
        <div className="py-16 text-center text-zinc-500">작업 상태 확인 중…</div>
      )}

      {frameSets && <ResultPlayer frameSets={frameSets} />}
    </div>
  );
}
