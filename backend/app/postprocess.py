import re
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
matplotlib.rcParams["font.family"] = "Apple SD Gothic Neo"
matplotlib.rcParams["axes.unicode_minus"] = False
import matplotlib.pyplot as plt
import numpy as np
import vtk
from vtk.util.numpy_support import vtk_to_numpy

from .cases import RegisteredCase

STATIC_ROOT = Path(__file__).resolve().parent.parent / "static"
IT_PATTERN = re.compile(r"_iT(\d+)(?:iC\d+)?\.vti$")


def _list_frames(vtk_data_dir: Path, binary_name: str) -> list[tuple[int, Path]]:
    frames = []
    for f in vtk_data_dir.glob(f"{binary_name}_iT*iC00000.vti"):
        m = IT_PATTERN.search(f.name)
        if m:
            frames.append((int(m.group(1)), f))
    return sorted(frames, key=lambda x: x[0])


def _read_field(image: "vtk.vtkImageData", field_name: str, dims: tuple[int, int, int], is_vector: bool) -> np.ndarray:
    point_data = image.GetPointData()
    arr = point_data.GetArray(field_name)
    if arr is None:
        raise ValueError(f"Field '{field_name}' not found in VTK point data")
    np_arr = vtk_to_numpy(arr)

    nx, ny, nz = dims
    if is_vector:
        np_arr = np_arr.reshape(nz, ny, nx, -1)
        np_arr = np.linalg.norm(np_arr, axis=-1)
    elif np_arr.ndim > 1 and np_arr.shape[-1] > 1:
        # multi-component array used as a scalar field (e.g. phi): take the first component
        np_arr = np_arr.reshape(nz, ny, nx, -1)[..., 0]
    else:
        np_arr = np_arr.reshape(nz, ny, nx)

    if nz > 1:
        np_arr = np_arr[nz // 2, :, :]
    else:
        np_arr = np_arr[0, :, :]
    return np_arr


def generate_frames(job_id: str, case: RegisteredCase, vtk_data_dir: Path) -> dict[str, list[str]]:
    binary_name = case.binary_path.name
    frames = _list_frames(vtk_data_dir, binary_name)
    if not frames:
        raise RuntimeError("No VTK output frames were produced")

    out_dir = STATIC_ROOT / job_id
    out_dir.mkdir(parents=True, exist_ok=True)

    result: dict[str, list[str]] = {f.name: [] for f in case.spec.output_fields}

    reader = vtk.vtkXMLImageDataReader()
    field_data_cache: dict[int, tuple[vtk.vtkImageData, tuple[int, int, int]]] = {}

    for field in case.spec.output_fields:
        values_per_frame = []
        for idx, (iT, path) in enumerate(frames):
            if iT not in field_data_cache:
                reader.SetFileName(str(path))
                reader.Update()
                image = reader.GetOutput()
                field_data_cache[iT] = (image, image.GetDimensions())
            image, dims = field_data_cache[iT]
            data2d = _read_field(image, field.name, dims, is_vector=(field.kind == "vector"))
            values_per_frame.append(data2d)

        vmin = min(v.min() for v in values_per_frame)
        vmax = max(v.max() for v in values_per_frame)
        if vmin == vmax:
            vmax = vmin + 1e-9

        for idx, data2d in enumerate(values_per_frame):
            fig, ax = plt.subplots(figsize=(6, 5))
            im = ax.imshow(data2d, cmap=field.colormap, origin="lower", vmin=vmin, vmax=vmax)
            ax.set_title(f"{field.label} ({field.unit})" if field.unit else field.label)
            ax.set_xticks([])
            ax.set_yticks([])
            fig.colorbar(im, ax=ax)
            out_path = out_dir / f"{field.name}_{idx:04d}.png"
            fig.savefig(out_path, dpi=100, bbox_inches="tight")
            plt.close(fig)
            result[field.name].append(f"/static/{job_id}/{field.name}_{idx:04d}.png")

    return result
