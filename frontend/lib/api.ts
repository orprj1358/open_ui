const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export type ParameterSpec = {
  name: string;
  label: string;
  type: "float" | "int";
  default: number;
  min: number;
  max: number;
  unit: string;
};

export type OutputFieldSpec = {
  name: string;
  label: string;
  colormap: string;
  unit: string;
  kind: "vector" | "scalar";
};

export type CaseSpec = {
  id: string;
  display_name: string;
  description: string;
  category: "basic_flow" | "multiphase" | "thermal";
  dimension: "2D" | "3D";
  parameters: ParameterSpec[];
  output_fields: OutputFieldSpec[];
};

export type JobStatus = "queued" | "running" | "done" | "failed";

export type SimulationJob = {
  job_id: string;
  case_id: string;
  status: JobStatus;
  parameters: Record<string, number>;
  progress: number;
  error: string | null;
};

export type FrameSet = {
  field: string;
  label: string;
  urls: string[];
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`API error ${res.status}: ${detail}`);
  }
  return res.json();
}

export function getCases(): Promise<CaseSpec[]> {
  return apiFetch("/api/cases");
}

export function getCase(caseId: string): Promise<CaseSpec | undefined> {
  return getCases().then((cases) => cases.find((c) => c.id === caseId));
}

export function createSimulation(caseId: string, parameters: Record<string, number>): Promise<SimulationJob> {
  return apiFetch("/api/simulations", {
    method: "POST",
    body: JSON.stringify({ case_id: caseId, parameters }),
  });
}

export function getSimulation(jobId: string): Promise<SimulationJob> {
  return apiFetch(`/api/simulations/${jobId}`);
}

export function getSimulationFrames(jobId: string): Promise<FrameSet[]> {
  return apiFetch(`/api/simulations/${jobId}/frames`);
}

export function assetUrl(path: string): string {
  return `${API_BASE}${path}`;
}
