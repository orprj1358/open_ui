import Link from "next/link";

const features = [
  {
    title: "브라우저에서 바로 실행",
    body: "C++ 컴파일도, 클러스터 접속도 필요 없습니다. 파라미터를 고르고 실행 버튼만 누르면 OpenLB 솔버가 서버에서 돌아갑니다.",
  },
  {
    title: "2D & 3D 물리 모델",
    body: "기본 유동(cavity, 원기둥 주위 유동)부터 Shan-Chen 다상유동, Rayleigh–Bénard 열대류까지 대표 케이스를 제공합니다.",
  },
  {
    title: "결과 시각화 내장",
    body: "속도·압력·온도·상분율 필드를 프레임별 애니메이션으로 재생하고, 원본 VTK 데이터 경로도 확인할 수 있습니다.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-20 py-8">
      <section className="flex flex-col items-center gap-6 text-center">
        <span className="rounded-full border border-sky-800 bg-sky-950/50 px-3 py-1 text-xs text-sky-300">
          Lattice Boltzmann Method · Open Source
        </span>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          CFD 시뮬레이션을
          <br />
          <span className="text-sky-400">클릭 몇 번</span>으로.
        </h1>
        <p className="max-w-xl text-lg leading-8 text-zinc-400">
          OpenLB Cloud는 오픈소스 격자 볼츠만 솔버{" "}
          <a
            href="https://www.openlb.net"
            className="underline decoration-zinc-600 hover:text-zinc-200"
          >
            OpenLB
          </a>
          를 SaaS 형태로 감싼 데모입니다. 파라미터 입력부터 결과 애니메이션까지
          전 과정을 웹에서 경험해 보세요.
        </p>
        <Link
          href="/gallery"
          className="rounded-lg bg-sky-500 px-6 py-3 font-medium text-white shadow-lg shadow-sky-900/40 transition hover:bg-sky-400"
        >
          시뮬레이션 시작하기 →
        </Link>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6"
          >
            <h3 className="mb-2 font-semibold text-zinc-100">{f.title}</h3>
            <p className="text-sm leading-6 text-zinc-400">{f.body}</p>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 text-center">
        <h2 className="mb-3 text-xl font-semibold">어떻게 동작하나요?</h2>
        <p className="mx-auto max-w-2xl text-sm leading-7 text-zinc-400">
          갤러리에서 케이스 선택 → 물리 파라미터 입력 → 서버가 OpenLB 바이너리를
          실행 → VTK 결과를 필드별 이미지 프레임으로 변환 → 브라우저에서
          애니메이션 재생. 모든 계산은 로컬 백엔드에서 수행되는 프로토타입입니다.
        </p>
      </section>
    </div>
  );
}
