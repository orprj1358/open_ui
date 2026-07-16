# OpenLB Cloud — CFD Simulation as a Service (Demo)

오픈소스 격자 볼츠만(LBM) 솔버 [OpenLB](https://www.openlb.net)를 SaaS 형태의 웹 UI로 감싼
데모 프로토타입입니다. 브라우저에서 케이스를 고르고 파라미터를 조정하면, 백엔드가 OpenLB
바이너리를 실행하고 VTK 결과를 필드별 애니메이션으로 시각화합니다.

## 구성

```
backend/    FastAPI (Python 3.12) — 케이스 레지스트리, 작업 큐, VTK→PNG 후처리
frontend/   Next.js 16 + React + Tailwind — 랜딩, 갤러리, 파라미터 폼, 결과 플레이어
```

### 제공 케이스 (6종)

| 케이스 | 물리 | 차원 |
|---|---|---|
| Lid-Driven Cavity | 기본 유동 | 2D / 3D |
| Flow Past a Cylinder (Kármán vortex) | 기본 유동 | 2D |
| Rising Bubble (Shan-Chen) | 다상 유동 | 2D |
| Phase Separation (spinodal) | 다상 유동 | 3D |
| Rayleigh–Bénard Convection | 열 유동 | 2D |

## 사전 요구사항

- macOS, Homebrew
- OpenLB 소스가 `~/code_simulation/openlb-test/olb-release`에 있고, 아래 6개 예제가
  컴파일되어 있어야 함 (각 예제 디렉토리에서 `make`):
  - `examples/forBeginners/cavity2d`
  - `examples/laminar/cylinder2d`, `examples/laminar/cavity3d`
  - `examples/multiComponent/risingBubble2d`, `examples/multiComponent/phaseSeparation3d`
  - `examples/thermal/rayleighBenard2d`
- Node.js (`brew install node`), Python 3.12 (`brew install python@3.12`)

## 실행

터미널 1 — 백엔드 (포트 8000):

```bash
cd backend
python3.12 -m venv venv          # 최초 1회
./venv/bin/pip install -r requirements.txt   # 최초 1회
./venv/bin/uvicorn app.main:app --port 8000
```

터미널 2 — 프론트엔드 (포트 3000):

```bash
cd frontend
npm install                       # 최초 1회
npm run dev
```

브라우저에서 http://localhost:3000 접속.

## 새 케이스 추가하기

`backend/app/cases.py`의 `CASES` 딕셔너리에 항목을 추가하면 됩니다 — 바이너리 경로,
노출할 CLI 파라미터(`--NAME VALUE` 형식으로 전달됨), VTK 출력 필드명/컬러맵을 선언하면
실행·후처리·UI가 모두 자동으로 따라옵니다. 필드명은 해당 예제의 `.vti` 출력에서 실제
배열 이름을 확인해 사용하세요.

## 제한 사항 (프로토타입)

- 인증/결제 없음, 작업 상태는 서버 메모리에만 유지 (재시작 시 소실)
- 단일 워커 순차 실행, 작업당 180초 타임아웃
- 3D 케이스는 중앙 단면(mid-plane) 슬라이스로 시각화
- OpenLB는 GPL v2 라이선스입니다 — 서비스 확장 시 라이선스 고지를 유지하세요.
