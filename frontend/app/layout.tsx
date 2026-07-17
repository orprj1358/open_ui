import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import packageJson from "../package.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OpenLB Cloud — CFD Simulation as a Service",
  description:
    "오픈소스 격자 볼츠만(LBM) 솔버 OpenLB를 웹에서 실행하고 결과를 시각화하는 데모 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100">
        <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
          <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold tracking-tight"
            >
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-sky-400" />
              OpenLB <span className="text-sky-400">Cloud</span>
              <span className="ml-2 rounded-full border border-zinc-700 px-2 py-0.5 text-[10px] font-normal uppercase tracking-wider text-zinc-400">
                demo
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm text-zinc-400">
              <Link href="/gallery" className="transition hover:text-zinc-100">
                시뮬레이션 갤러리
              </Link>
              <a
                href="https://www.openlb.net"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-zinc-100"
              >
                OpenLB ↗
              </a>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
          {children}
        </main>
        <footer className="border-t border-zinc-800 py-6 text-center text-xs text-zinc-500">
          <p>
            Powered by{" "}
            <a
              href="https://www.openlb.net"
              className="underline hover:text-zinc-300"
            >
              OpenLB
            </a>{" "}
            (GPL v2) — 데모 프로토타입 · 로컬 실행 환경
          </p>
          <p className="mt-1">
            OpenLB Cloud v{packageJson.version}
          </p>
        </footer>
      </body>
    </html>
  );
}
