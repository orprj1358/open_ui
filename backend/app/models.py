from typing import Literal

from pydantic import BaseModel


class ParameterSpec(BaseModel):
    name: str  # OpenLB CLI flag name, e.g. PHYS_CHAR_VELOCITY
    label: str
    type: Literal["float", "int"]
    default: float
    min: float
    max: float
    unit: str = ""


class OutputFieldSpec(BaseModel):
    name: str  # VTK field name as written by the case, e.g. "velocity"
    label: str
    colormap: str
    unit: str = ""
    kind: Literal["vector", "scalar"] = "scalar"


class CaseSpec(BaseModel):
    id: str
    display_name: str
    description: str
    category: Literal["basic_flow", "multiphase", "thermal"]
    dimension: Literal["2D", "3D"]
    parameters: list[ParameterSpec]
    output_fields: list[OutputFieldSpec]


class SimulationRequest(BaseModel):
    case_id: str
    parameters: dict[str, float] = {}


JobStatus = Literal["queued", "running", "done", "failed"]


class SimulationJob(BaseModel):
    job_id: str
    case_id: str
    status: JobStatus
    parameters: dict[str, float]
    progress: float = 0.0
    error: str | None = None


class FrameSet(BaseModel):
    field: str
    label: str
    urls: list[str]
