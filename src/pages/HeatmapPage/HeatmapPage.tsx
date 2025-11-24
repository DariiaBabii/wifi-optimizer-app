import React, { useState, useRef } from 'react';
import { Widget } from '../../components/Widget/Widget';
import { Upload, Trash2, Save, Map as MapIcon, Plus, Info } from 'lucide-react';
import './HeatmapPage.css';

interface MeasurementPoint {
  id: number;
  x: number;
  y: number;
  rssi: number;
}

export const HeatmapPage = () => {
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [points, setPoints] = useState<MeasurementPoint[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  //Image Upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMapImage(e.target?.result as string);
        setPoints([]);
      };
      reader.readAsDataURL(file);
    }
  };
// Adding a point on click
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapImage) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Імітація сигналу (пізніше тут буде виклик API scan)
    const mockRssi = Math.floor(Math.random() * (-40 - -90 + 1)) + -90;

    const newPoint: MeasurementPoint = {
      id: Date.now(),
      x,
      y,
      rssi: mockRssi,
    };

    setPoints([...points, newPoint]);
  };

  // Delete the last point
  const undoLastPoint = () => {
    setPoints(points.slice(0, -1));
  };

  // Determining the color of the point
  const getSignalColor = (rssi: number) => {
    if (rssi >= -50) return 'rgba(76, 209, 55, 0.6)';
    if (rssi >= -70) return 'rgba(251, 197, 49, 0.6)';
    return 'rgba(232, 65, 24, 0.6)'
  };

  return (
    <div className="heatmap-container">

      <div className="heatmap-toolbar">
        <Info size={20} className="banner-icon" />
        <div className="toolbar-left">
          
          <h3>Wi-Fi Coverage Map</h3>
          <p>Upload a floor plan and click to map signal strength.</p>
        </div>

      <div className="toolbar-actions">
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleImageUpload}
          />

      <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
            <Upload size={18} /> Upload Plan
          </button>

          {points.length > 0 && (
            <button className="btn-secondary" onClick={undoLastPoint}>
              <Trash2 size={18} /> Undo
            </button>
          )}

          <button className="btn-primary" disabled={!mapImage}>
            <Save size={18} /> Save Map
          </button>
        </div>
      </div>
      <Widget className="heatmap-workspace">
        {mapImage ? (
          <div className="map-wrapper" onClick={handleMapClick}>
            <img src={mapImage} alt="Floor Plan" className="floor-plan-img" />
            
            {/* Рендеринг точок */}
            {points.map((point) => (
              <div
                key={point.id}
                className="signal-point"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  backgroundColor: getSignalColor(point.rssi),
                  boxShadow: `0 0 20px 10px ${getSignalColor(point.rssi)}` // Ефект світіння
                }}
              >
                <span className="point-tooltip">{point.rssi} dBm</span>
              </div>
            ))}
          </div>
        ) : (
          // Заглушка, якщо карта не завантажена
          <div className="empty-map-state" onClick={() => fileInputRef.current?.click()}>
            <div className="upload-placeholder">
              <MapIcon size={64} color="#cbd5e1" />
              <h4>No Floor Plan Uploaded</h4>
              <p>Click to upload an image of your room or office</p>
              <button className="btn-upload-big">
                <Plus size={20} /> Select Image
              </button>
            </div>
          </div>
        )}
      </Widget>
    </div>
  );
};