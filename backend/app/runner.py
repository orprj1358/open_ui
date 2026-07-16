import subprocess
from pathlib import Path

from .cases import RegisteredCase

JOBS_ROOT = Path(__file__).resolve().parent.parent / "jobs"
JOB_TIMEOUT_SECONDS = 180


def build_cli_args(case: RegisteredCase, parameters: dict[str, float]) -> list[str]:
    args: list[str] = []
    specs = {p.name: p for p in case.spec.parameters}
    for name, value in parameters.items():
        spec = specs.get(name)
        if spec is None:
            raise ValueError(f"Unknown parameter '{name}' for case '{case.spec.id}'")
        rendered = str(int(value)) if spec.type == "int" else str(value)
        args += [f"--{name}", rendered]
    for name, value in case.fixed_args.items():
        args += [f"--{name}", value]
    return args


def run_case(job_id: str, case: RegisteredCase, parameters: dict[str, float]) -> Path:
    job_dir = JOBS_ROOT / job_id
    job_dir.mkdir(parents=True, exist_ok=True)

    args = [str(case.binary_path)] + build_cli_args(case, parameters)
    result = subprocess.run(
        args,
        cwd=job_dir,
        capture_output=True,
        text=True,
        timeout=JOB_TIMEOUT_SECONDS,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr[-4000:] or result.stdout[-4000:])

    return job_dir / "tmp" / "vtkData" / "data"
