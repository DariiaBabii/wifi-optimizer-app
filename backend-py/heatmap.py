import numpy as np
import matplotlib.pyplot as plt
from scipy.interpolate import griddata, RBFInterpolator
from PIL import Image
import io


def generate_smooth_heatmap(points, width: int, height: int) -> bytes:
    print(f'points {points}')

    if not points:
        img = Image.new('RGBA', (width, height), (0, 0, 0, 0))
        buf = io.BytesIO()
        img.save(buf, format='PNG')
        return buf.getvalue()

    MIN_RSSI = -90
    MAX_RSSI = -30

    coords = np.array([[p.x, p.y] for p in points])
    rssi_values = np.array([p.rssi for p in points])
    normalized_values = np.clip((rssi_values - MIN_RSSI) / (MAX_RSSI - MIN_RSSI), 0, 1)

    # 2. Інтерполяція (RBFInterpolator)

    # Створення сітки (H, W) для вихідних точок
    grid_x, grid_y = np.mgrid[0:100:complex(0, width), 0:100:complex(0, height)]

    # Перетворення сітки (H, W) на вектор точок (W*H, 2)
    grid_points = np.c_[grid_x.ravel(), grid_y.ravel()]

    rbfi = RBFInterpolator(coords, normalized_values, kernel='multiquadric', epsilon=1)

    grid_z_vector = rbfi(grid_points)
    grid_z = grid_z_vector.reshape(grid_x.shape)

    grid_z = np.clip(grid_z, 0, 1)

    fig, ax = plt.subplots(figsize=(width / 100, height / 100), dpi=100)

    ax.set_xticks([])
    ax.set_yticks([])
    ax.set_facecolor('none')

    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    ax.set_aspect('equal')

    ax.invert_yaxis()

    plt.pcolormesh(
        grid_x,
        grid_y,
        grid_z,  # (H, W)
        cmap='jet_r',
        vmin=0,
        vmax=1,
        alpha=0.9,
        shading='nearest'
    )

    plt.subplots_adjust(left=0, right=1, bottom=0, top=1)

    mpl_buf = io.BytesIO()
    fig.savefig(mpl_buf, format='png', transparent=True, bbox_inches='tight', pad_inches=0)
    plt.close(fig)
    mpl_buf.seek(0)

    img = Image.open(mpl_buf)

    if img.size != (width, height):
        img = img.resize((width, height), Image.Resampling.LANCZOS)

    final_buf = io.BytesIO()
    img.save(final_buf, format='PNG')

    return final_buf.getvalue()
