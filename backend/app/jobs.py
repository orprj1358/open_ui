import queue
import threading
import traceback
import uuid

from .cases import get_case
from .models import SimulationJob
from .postprocess import generate_frames
from .runner import run_case

_JOBS: dict[str, SimulationJob] = {}
_FRAMES: dict[str, dict[str, list[str]]] = {}
_LOCK = threading.Lock()
_QUEUE: "queue.Queue[str]" = queue.Queue()


def submit_job(case_id: str, parameters: dict[str, float]) -> SimulationJob:
    case = get_case(case_id)  # raises KeyError if unknown

    for name, value in parameters.items():
        spec = next((p for p in case.spec.parameters if p.name == name), None)
        if spec is None:
            raise ValueError(f"Unknown parameter '{name}' for case '{case_id}'")
        if not (spec.min <= value <= spec.max):
            raise ValueError(f"Parameter '{name}' must be between {spec.min} and {spec.max}")

    job_id = uuid.uuid4().hex[:12]
    job = SimulationJob(job_id=job_id, case_id=case_id, status="queued", parameters=parameters)
    with _LOCK:
        _JOBS[job_id] = job
    _QUEUE.put(job_id)
    return job


def get_job(job_id: str) -> SimulationJob:
    with _LOCK:
        job = _JOBS.get(job_id)
    if job is None:
        raise KeyError(f"Unknown job_id '{job_id}'")
    return job


def get_frames(job_id: str) -> dict[str, list[str]]:
    with _LOCK:
        frames = _FRAMES.get(job_id)
    if frames is None:
        raise KeyError(f"No frames available for job_id '{job_id}'")
    return frames


def _update(job_id: str, **kwargs) -> None:
    with _LOCK:
        job = _JOBS[job_id]
        _JOBS[job_id] = job.model_copy(update=kwargs)


def _worker() -> None:
    while True:
        job_id = _QUEUE.get()
        try:
            job = get_job(job_id)
            case = get_case(job.case_id)
            _update(job_id, status="running", progress=0.1)

            vtk_data_dir = run_case(job_id, case, job.parameters)
            _update(job_id, progress=0.7)

            frames = generate_frames(job_id, case, vtk_data_dir)
            with _LOCK:
                _FRAMES[job_id] = frames

            _update(job_id, status="done", progress=1.0)
        except Exception as exc:  # noqa: BLE001
            traceback.print_exc()
            _update(job_id, status="failed", error=str(exc))
        finally:
            _QUEUE.task_done()


_worker_thread = threading.Thread(target=_worker, daemon=True)
_worker_thread.start()
