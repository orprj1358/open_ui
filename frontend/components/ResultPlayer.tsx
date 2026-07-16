"use client";

import { useEffect, useRef, useState } from "react";
import { assetUrl, type FrameSet } from "@/lib/api";

const FPS = 8;

export default function ResultPlayer({ frameSets }: { frameSets: FrameSet[] }) {
  const [fieldIdx, setFieldIdx] = useState(0);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = frameSets[fieldIdx];
  const total = current?.urls.length ?? 0;

  // preload all images of the selected field once
  useEffect(() => {
    current?.urls.forEach((u) => {
      const img = new Image();
      img.src = assetUrl(u);
    });
  }, [current]);

  useEffect(() => {
    if (!playing || total === 0) return;
    timerRef.current = setInterval(() => {
      setFrame((f) => (f + 1) % total);
    }, 1000 / FPS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, total]);

  if (!current || total === 0) {
    return <div className="text-sm text-zinc-500">표시할 프레임이 없습니다.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {frameSets.map((fs, i) => (
          <button
            key={fs.field}
            onClick={() => {
              setFieldIdx(i);
              setFrame(0);
            }}
            className={`rounded-lg px-3 py-1.5 text-sm transition ${
              i === fieldIdx
                ? "bg-sky-500 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {fs.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center rounded-xl border border-zinc-800 bg-white p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={assetUrl(current.urls[Math.min(frame, total - 1)])}
          alt={`${current.label} frame ${frame + 1}/${total}`}
          className="max-h-[480px] w-auto"
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="w-20 rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 transition hover:bg-zinc-700"
        >
          {playing ? "⏸ 정지" : "▶ 재생"}
        </button>
        <input
          type="range"
          min={0}
          max={total - 1}
          value={Math.min(frame, total - 1)}
          onChange={(e) => {
            setPlaying(false);
            setFrame(Number(e.target.value));
          }}
          className="flex-1 accent-sky-500"
        />
        <span className="w-16 text-right font-mono text-xs text-zinc-400">
          {Math.min(frame, total - 1) + 1} / {total}
        </span>
      </div>
    </div>
  );
}
