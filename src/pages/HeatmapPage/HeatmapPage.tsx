import React, { useState, useRef, useMemo } from 'react';
import { Widget } from '../../components/Widget/Widget';
import { Upload, Trash2, Save, Map as MapIcon, Plus, Play, Square, Loader2, Wifi, Info } from 'lucide-react';
import { useWifi, type WifiNetwork } from '../../context/WifiContext';
import './HeatmapPage.css';

interface SurveyPoint {
  id: number;
  x: number;
  y: number;
  rssi: number;
  status: 'pending' | 'success' | 'error'; 
  data?: WifiNetwork[];
}

export const HeatmapPage = () => {
  const [mapImage, setMapImage] = useState<string | null>(null);
  const [points, setPoints] = useState<SurveyPoint[]>([]);
  const [isScanningMode, setIsScanningMode] = useState(false);
  const [selectedSsid, setSelectedSsid] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  //Image Upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMapImage(e.target?.result as string);
        setPoints([]);
        setIsScanningMode(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleScanningMode = () => {
    if (!isScanningMode) {
      // Старт: Очищаємо попередні точки
      if (points.length > 0 && !window.confirm("Start new scan? Current points will be cleared.")) {
        return;
      }
      setPoints([]);
      setSelectedSsid(''); 
      setIsScanningMode(true);
    } else {
      // Стоп
      setIsScanningMode(false);
      // Автоматично обираємо найсильнішу мережу з останньої точки для відображення
      if (points.length > 0) {
        const lastData = points[points.length - 1].data;
        if (lastData && lastData.length > 0) {
          setSelectedSsid(lastData[0].ssid);
        }
      }
    }
  };

// Adding a point on click
const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapImage || !isScanningMode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // точка зі статусом "Очікуйте"
    const newPoint: SurveyPoint = {
      id: Date.now(),
      x, y,
      status: 'pending',
      rssi: 0
    };

    setPoints(prev => [...prev, newPoint]);

        // сканування для цієї точки
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
          const response = await fetch(`${API_URL}/api/scan`);
          const result = await response.json();

          if (result.success) {
            // Оновлюємо точку успішними даними
            setPoints(currentPoints => 
              currentPoints.map(p => 
                p.id === newPoint.id 
                  ? { ...p, status: 'success', data: result.data } 
                  : p
              )
            );
          } else {
            throw new Error("Scan failed");
          }
        } catch (err) {

          // Позначаємо точку як помилкову
          setPoints(currentPoints => 
            currentPoints.map(p => 
              p.id === newPoint.id ? { ...p, status: 'error' } : p
            )
          );
        }
      };

// Отримання списку унікальних SSID для дропдауна
  const availableNetworks = useMemo(() => {
    const ssids = new Set<string>();
    points.forEach(p => {
      p.data?.forEach(net => {
        if (net.ssid) ssids.add(net.ssid);
      });
    });
    return Array.from(ssids).sort();
  }, [points]);


  // // Delete the last point
  // const undoLastPoint = () => {
  //   setPoints(points.slice(0, -1));
  // };

// Determining the color of the point
  const getPointStyle = (point: SurveyPoint) => {
      // Якщо сканування ще йде
      if (point.status === 'pending') return { bg: '#ccc', border: '#999', shadow: 'none' };
      if (point.status === 'error') return { bg: '#ef4444', border: '#b91c1c', shadow: 'none' };

      // Якщо сканування завершено, шукаємо рівень сигналу вибраної мережі
      if (selectedSsid && point.data) {
        const network = point.data.find(n => n.ssid === selectedSsid);
        
        if (network) {
          // Мережа знайдена в цій точці -> визначаємо колір за RSSI
          const rssi = network.rssi;
          let color = '#ef4444'; // Bad (< -80)
          if (rssi >= -50) color = '#10b981'; // Excellent
          else if (rssi >= -60) color = '#3b82f6'; // Good
          else if (rssi >= -70) color = '#f59e0b'; // Fair
          else if (rssi >= -80) color = '#f97316'; // Poor

          return { bg: color, border: '#fff', shadow: `0 0 15px 2px ${color}` };
        } else {
          // Мережа НЕ ловить в цій точці
          return { bg: 'transparent', border: '#aaa', shadow: 'none', opacity: 0.5 };
        }
      }

      // Якщо мережа не вибрана, просто показуємо, що точка є (зелена)
      return { bg: '#10b981', border: '#fff', shadow: 'none' };
    };

  return (
      <div className="heatmap-container">
        
        {/* Toolbar */}
        <div className="heatmap-toolbar">
          <Info size={20} className="banner-icon" />
          <div className="toolbar-left">
            <h3>Coverage Mapper</h3>
            <p>{isScanningMode ? 'Click on the map to measure signal at your current location.' : 'Start scan to begin mapping.'}</p>
          </div>
          
          <div className="toolbar-actions">
            {/* Dropdown для вибору мережі (показуємо тільки якщо є дані) */}
            {points.length > 0 && !isScanningMode && (
              <div className="network-selector">
                <Wifi size={16} className="selector-icon"/>
                <select 
                  value={selectedSsid} 
                  onChange={(e) => setSelectedSsid(e.target.value)}
                  className="ssid-select"
                >
                  <option value="" disabled>Select Network to View</option>
                  {availableNetworks.map(ssid => (
                    <option key={ssid} value={ssid}>{ssid}</option>
                  ))}
                </select>
              </div>
            )}

            {!mapImage && (
              <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
                <Upload size={18} /> Upload Plan
              </button>
            )}

            {/* Головна кнопка Start/Finish */}
            {mapImage && (
              <button 
                className={`btn-scan-toggle ${isScanningMode ? 'active' : ''}`} 
                onClick={toggleScanningMode}
              >
                {isScanningMode ? (
                  <><Square size={18} fill="currentColor" /> Finish Scan</>
                ) : (
                  <><Play size={18} fill="currentColor" /> Start Scan</>
                )}
              </button>
            )}
            
            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload}/>
          </div>
        </div>

        {/* Workspace */}
        <Widget className="heatmap-workspace">
          {mapImage ? (
            <div className={`map-wrapper ${isScanningMode ? 'scanning-cursor' : ''}`} onClick={handleMapClick}>
              <img src={mapImage} alt="Floor Plan" className="floor-plan-img" />
              
              {points.map((point) => {
                const style = getPointStyle(point);
                const networkData = point.data?.find(n => n.ssid === selectedSsid);

                return (
                  <div
                    key={point.id}
                    className={`signal-point ${point.status}`}
                    style={{
                      left: `${point.x}%`,
                      top: `${point.y}%`,
                      backgroundColor: style.bg,
                      borderColor: style.border,
                      boxShadow: style.shadow,
                      opacity: (style as any).opacity || 1
                    }}
                  >
                    {/* Спіннер, якщо скануємо */}
                    {point.status === 'pending' && <Loader2 size={14} className="point-spinner" />}
                    
                    {/* Тултіп при наведенні */}
                    {point.status === 'success' && selectedSsid && (
                      <div className="point-tooltip">
                        <strong>{selectedSsid}</strong>
                        <br/>
                        {networkData ? `${networkData.rssi} dBm` : 'No Signal'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-map-state" onClick={() => fileInputRef.current?.click()}>
              <div className="upload-placeholder">
                <MapIcon size={64} color="#cbd5e1" />
                <h4>No Floor Plan</h4>
                <button className="btn-upload-big"><Plus size={20} /> Upload Image</button>
              </div>
            </div>
          )}
        </Widget>
      </div>
    );
  };