from pathlib import Path

from pydantic import BaseModel

from .models import CaseSpec, OutputFieldSpec, ParameterSpec

OLB_ROOT = Path.home() / "code_simulation" / "openlb-test" / "olb-release" / "examples"


class RegisteredCase(BaseModel):
    spec: CaseSpec
    binary_path: Path
    fixed_args: dict[str, str] = {}


CASES: dict[str, RegisteredCase] = {
    "cavity2d": RegisteredCase(
        spec=CaseSpec(
            id="cavity2d",
            display_name="Lid-Driven Cavity (2D)",
            description="정사각형 공동 위쪽 벽이 일정 속도로 미끄러지며 만드는 2D 순환 유동",
            category="basic_flow",
            dimension="2D",
            parameters=[
                ParameterSpec(name="PHYS_CHAR_VELOCITY", label="리드 속도", type="float", default=1.0, min=0.1, max=3.0, unit="m/s"),
                ParameterSpec(name="PHYS_CHAR_VISCOSITY", label="동점성계수", type="float", default=0.001, min=0.0001, max=0.01, unit="m²/s"),
                ParameterSpec(name="MAX_PHYS_T", label="시뮬레이션 시간", type="float", default=20.0, min=5.0, max=40.0, unit="s"),
            ],
            output_fields=[
                OutputFieldSpec(name="physVelocity", label="속도", colormap="viridis", unit="m/s", kind="vector"),
                OutputFieldSpec(name="physPressure", label="압력", colormap="coolwarm", unit="Pa", kind="scalar"),
            ],
        ),
        binary_path=OLB_ROOT / "forBeginners" / "cavity2d" / "cavity2d",
    ),
    "cylinder2d": RegisteredCase(
        spec=CaseSpec(
            id="cylinder2d",
            display_name="Flow Past a Cylinder (2D)",
            description="원기둥 뒤편에서 발생하는 카르만 와열 (von Kármán vortex street)",
            category="basic_flow",
            dimension="2D",
            parameters=[
                ParameterSpec(name="PHYS_CHAR_VELOCITY", label="유입 속도", type="float", default=0.2, min=0.05, max=1.0, unit="m/s"),
                ParameterSpec(name="REYNOLDS", label="레이놀즈 수", type="float", default=20.0, min=5.0, max=150.0),
                ParameterSpec(name="MAX_PHYS_T", label="시뮬레이션 시간", type="float", default=16.0, min=5.0, max=30.0, unit="s"),
            ],
            output_fields=[
                OutputFieldSpec(name="physVelocity", label="속도", colormap="viridis", unit="m/s", kind="vector"),
                OutputFieldSpec(name="physPressure", label="압력", colormap="coolwarm", unit="Pa", kind="scalar"),
            ],
        ),
        binary_path=OLB_ROOT / "laminar" / "cylinder2d" / "cylinder2d",
    ),
    "cavity3d": RegisteredCase(
        spec=CaseSpec(
            id="cavity3d",
            display_name="Lid-Driven Cavity (3D)",
            description="3D 정육면체 공동에서 발생하는 순환 유동 (중앙 단면 시각화)",
            category="basic_flow",
            dimension="3D",
            parameters=[
                ParameterSpec(name="PHYS_CHAR_VELOCITY", label="리드 속도", type="float", default=1.0, min=0.1, max=3.0, unit="m/s"),
                ParameterSpec(name="PHYS_CHAR_VISCOSITY", label="동점성계수", type="float", default=0.001, min=0.0001, max=0.01, unit="m²/s"),
                ParameterSpec(name="RESOLUTION", label="해상도", type="int", default=30, min=10, max=40),
            ],
            output_fields=[
                OutputFieldSpec(name="physVelocity", label="속도", colormap="viridis", unit="m/s", kind="vector"),
                OutputFieldSpec(name="physPressure", label="압력", colormap="coolwarm", unit="Pa", kind="scalar"),
            ],
        ),
        binary_path=OLB_ROOT / "laminar" / "cavity3d" / "cavity3d",
    ),
    "risingBubble2d": RegisteredCase(
        spec=CaseSpec(
            id="risingBubble2d",
            display_name="Rising Bubble (2D)",
            description="Shan-Chen 다상유동 모델로 구현한 기포 상승 시뮬레이션",
            category="multiphase",
            dimension="2D",
            parameters=[
                ParameterSpec(name="RESOLUTION", label="해상도", type="int", default=15, min=10, max=25),
                ParameterSpec(name="MAX_PHYS_T", label="시뮬레이션 시간", type="float", default=0.0004, min=0.0001, max=0.0008, unit="s"),
                ParameterSpec(name="BOND", label="본드 수 (부력/표면장력)", type="float", default=10.0, min=1.0, max=50.0),
            ],
            output_fields=[
                OutputFieldSpec(name="u", label="속도", colormap="viridis", unit="m/s", kind="vector"),
                OutputFieldSpec(name="rho", label="밀도", colormap="viridis", unit="kg/m³", kind="scalar"),
                OutputFieldSpec(name="phi", label="상분율", colormap="RdBu", kind="scalar"),
            ],
        ),
        binary_path=OLB_ROOT / "multiComponent" / "risingBubble2d" / "risingBubble2d",
    ),
    "phaseSeparation3d": RegisteredCase(
        spec=CaseSpec(
            id="phaseSeparation3d",
            display_name="Phase Separation (3D)",
            description="Shan-Chen 다상유동 모델의 3D 상분리(spinodal decomposition) 시뮬레이션 (중앙 단면 시각화)",
            category="multiphase",
            dimension="3D",
            parameters=[
                ParameterSpec(name="MAX_LATTICE_T", label="격자 시간 스텝", type="int", default=400, min=200, max=800),
                ParameterSpec(name="PHYS_CHAR_VISCOSITY", label="동점성계수", type="float", default=0.1, min=0.01, max=0.5, unit="m²/s"),
            ],
            output_fields=[
                OutputFieldSpec(name="velocity", label="속도", colormap="viridis", unit="m/s", kind="vector"),
                OutputFieldSpec(name="density", label="밀도", colormap="viridis", unit="kg/m³", kind="scalar"),
            ],
        ),
        binary_path=OLB_ROOT / "multiComponent" / "phaseSeparation3d" / "phaseSeparation3d",
        fixed_args={"DOMAIN_EXTENT": "[32 32 32]"},
    ),
    "rayleighBenard2d": RegisteredCase(
        spec=CaseSpec(
            id="rayleighBenard2d",
            display_name="Rayleigh–Bénard Convection (2D)",
            description="아래는 뜨겁고 위는 차가운 유체층에서 발생하는 열대류 셀",
            category="thermal",
            dimension="2D",
            parameters=[
                ParameterSpec(name="RAYLEIGH", label="레일리 수", type="float", default=10000.0, min=1000.0, max=50000.0),
                ParameterSpec(name="PRANDTL", label="프란틀 수", type="float", default=0.71, min=0.1, max=10.0),
                ParameterSpec(name="MAX_PHYS_T", label="시뮬레이션 시간", type="float", default=1000.0, min=200.0, max=1500.0, unit="s"),
            ],
            output_fields=[
                OutputFieldSpec(name="physVelocity", label="속도", colormap="viridis", unit="m/s", kind="vector"),
                OutputFieldSpec(name="physPressure", label="압력", colormap="coolwarm", unit="Pa", kind="scalar"),
                OutputFieldSpec(name="physTemperature", label="온도", colormap="coolwarm", unit="K", kind="scalar"),
            ],
        ),
        binary_path=OLB_ROOT / "thermal" / "rayleighBenard2d" / "rayleighBenard2d",
    ),
}


def get_case(case_id: str) -> RegisteredCase:
    if case_id not in CASES:
        raise KeyError(f"Unknown case_id '{case_id}'")
    return CASES[case_id]


def list_cases() -> list[CaseSpec]:
    return [c.spec for c in CASES.values()]
