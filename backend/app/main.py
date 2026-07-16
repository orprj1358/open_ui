from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import jobs
from .cases import list_cases
from .models import CaseSpec, FrameSet, SimulationJob, SimulationRequest

STATIC_ROOT = Path(__file__).resolve().parent.parent / "static"
STATIC_ROOT.mkdir(parents=True, exist_ok=True)

app = FastAPI(title="OpenLB Cloud Demo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=STATIC_ROOT), name="static")


@app.get("/api/cases", response_model=list[CaseSpec])
def get_cases() -> list[CaseSpec]:
    return list_cases()


@app.post("/api/simulations", response_model=SimulationJob)
def create_simulation(req: SimulationRequest) -> SimulationJob:
    try:
        return jobs.submit_job(req.case_id, req.parameters)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/api/simulations/{job_id}", response_model=SimulationJob)
def get_simulation(job_id: str) -> SimulationJob:
    try:
        return jobs.get_job(job_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@app.get("/api/simulations/{job_id}/frames", response_model=list[FrameSet])
def get_simulation_frames(job_id: str) -> list[FrameSet]:
    job = get_simulation(job_id)
    if job.status != "done":
        raise HTTPException(status_code=409, detail=f"Job is not done yet (status={job.status})")
    try:
        frames = jobs.get_frames(job_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc

    from .cases import get_case

    case = get_case(job.case_id)
    label_by_name = {f.name: f.label for f in case.spec.output_fields}
    return [FrameSet(field=name, label=label_by_name.get(name, name), urls=urls) for name, urls in frames.items()]
