import React, { useState, useRef, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';
import { Widget } from '../../components/Widget/Widget';
import { 
  Upload, 
  Save, 
  Map as MapIcon, 
  Plus, 
  Play, 
  Square, 
  Loader2, 
  Wifi, 
  Info, 
  Trash2,
  MapPin 
} from 'lucide-react';
import { type WifiNetwork } from '../../context/WifiContext';
import { ConfirmModal } from '../../components/Modal/ConfirmModal';
import './HeatmapPage.css';

const STORAGE_KEY_MAP = 'heatmap_image_data';
const STORAGE_KEY_POINTS = 'heatmap_points_data';

interface SurveyPoint {
  id: number;
  x: number;
  y: number;
  status: 'pending' | 'success' | 'error'; 
  data?: WifiNetwork[];
}

export const HeatmapPage = () => {
  const { t } = useTranslation();
  
  // --- STATES ---
  const [mapImage, setMapImage] = useState<string | null>(() => {
    return sessionStorage.getItem(STORAGE_KEY_MAP);
  });
  
  const [points, setPoints] = useState<SurveyPoint[]>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY_POINTS);
    return saved ? JSON.parse(saved) : [];
  });

  // Новий стейт для згенерованої теплової карти (overlay)
  const [heatmapImage, setHeatmapImage] = useState<string | null>(null);
  const [isGeneratingHeatmap, setIsGeneratingHeatmap] = useState(false);

  const [isScanningMode, setIsScanningMode] = useState(false);
  const [selectedSsid, setSelectedSsid] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false); 

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'clear_map' | 'new_scan' | null;
  }>({ isOpen: false, type: null });

  // --- EFFECTS ---
  useEffect(() => {
    if (mapImage) {
      sessionStorage.setItem(STORAGE_KEY_MAP, mapImage);
    } else {
      sessionStorage.removeItem(STORAGE_KEY_MAP);
    }
  }, [mapImage]);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY_POINTS, JSON.stringify(points));
  }, [points]);

  // --- HELPER FUNCTIONS ---
  
  const clearSession = () => {
     sessionStorage.removeItem(STORAGE_KEY_MAP);
     sessionStorage.removeItem(STORAGE_KEY_POINTS);
     setMapImage(null);
     setHeatmapImage(null); 
     setPoints([]);
     setIsScanningMode(false);
     setSelectedSsid('');
  };

  const startScan = () => {
      setPoints([]);
      setHeatmapImage(null); 
      setSelectedSsid(''); 
      setIsScanningMode(true);
  };

  // --- HANDLERS ---

  // Image Upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        clearSession();
        const result = e.target?.result as string;
        setMapImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Клік на смітник -> відкриває модалку
  const handleClearMap = () => {
    setModalConfig({ isOpen: true, type: 'clear_map' });
  };

  // Клік на Start/Stop Scan
  const toggleScanningMode = () => {
    if (!isScanningMode) {
      // Якщо намагаємось почати нове сканування, а точки вже є -> питаємо підтвердження
      if (points.length > 0) {
        setModalConfig({ isOpen: true, type: 'new_scan' });
        return;
      }
      startScan();
    } else {
      // СТОП 
      setIsScanningMode(false);
      
      if (points.length > 0) {
        const lastData = points[points.length - 1].data;
        if (lastData && lastData.length > 0) {
          const bestNet = [...lastData].sort((a, b) => b.rssi - a.rssi)[0];
          setSelectedSsid(bestNet.ssid);
        }
      }
    }
  };

  const performConfirmedAction = () => {
    if (modalConfig.type === 'clear_map') {
       clearSession();
       toast.success(t('heatmap.map_cleared') || "Map cleared");
    } else if (modalConfig.type === 'new_scan') {
       startScan();
    }
    setModalConfig({ isOpen: false, type: null });
  };

  // Додавання точки на карту
  const handleMapClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapImage || !isScanningMode) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPoint: SurveyPoint = {
      id: Date.now(),
      x, y,
      status: 'pending',
    };

    setPoints(prev => [...prev, newPoint]);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/scan`);
      const result = await response.json();

      if (result.success) {
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
      setPoints(currentPoints => 
        currentPoints.map(p => 
          p.id === newPoint.id ? { ...p, status: 'error' } : p
        )
      );
      toast.error("Scan failed for this point");
    }
  };

  const availableNetworks = useMemo(() => {
    const ssids = new Set<string>();
    points.forEach(p => {
      p.data?.forEach(net => {
        if (net.ssid) ssids.add(net.ssid);
      });
    });
    return Array.from(ssids).sort();
  }, [points]);

  const getPointStyle = (point: SurveyPoint) => {
      if (point.status === 'pending') return { bg: '#ccc', border: '#999', shadow: 'none' };
      if (point.status === 'error') return { bg: '#ef4444', border: '#b91c1c', shadow: 'none' };

      if (selectedSsid && point.data) {
        const network = point.data.find(n => n.ssid === selectedSsid);
        
        if (network) {
          const rssi = network.rssi;
          let color = '#ef4444';
          if (rssi >= -50) color = '#10b981';
          else if (rssi >= -60) color = '#3b82f6';
          else if (rssi >= -70) color = '#f59e0b';
          else if (rssi >= -80) color = '#f97316';

          return { bg: color, border: '#fff', shadow: `0 0 15px 2px ${color}` };
        } else {
          return { bg: 'transparent', border: '#aaa', shadow: 'none', opacity: 0.5 };
        }
      }
      return { bg: '#10b981', border: '#fff', shadow: 'none' };
  };

  // --- ГЕНЕРАЦІЯ HEATMAP ---
  const generateHeatmap = async () => {
    // Перевірки
    if (!selectedSsid) {
        toast.error("Please select a network first");
        return;
    }
    const successPoints = points.filter(p => p.status === 'success');
    if (successPoints.length < 3) {
        toast.error("Need at least 3 points to generate heatmap");
        return;
    }
    if (!imageRef.current) return;

    setIsGeneratingHeatmap(true);
    setHeatmapImage(null);

    try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        
        // Підготовка даних для бекенду
        // Витягуємо RSSI для обраної мережі (selectedSsid) з кожної точки
        const pointsPayload = successPoints.map(p => {
            const net = p.data?.find(n => n.ssid === selectedSsid);
            return {
                x: Math.round(p.x), 
                y: Math.round(p.y),
                rssi: net ? net.rssi : -95 
            };
        });

        const width = imageRef.current.clientWidth;
        const height = imageRef.current.clientHeight;

        const response = await fetch(`${API_URL}/api/generate_heatmap`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ssid: selectedSsid,
                points: pointsPayload,
                width: Math.round(width),
                height: Math.round(height),
                all_points_json: sessionStorage.getItem(STORAGE_KEY_POINTS) || '[]'
            })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        if (result.heatmap_base64) {
            setHeatmapImage(result.heatmap_base64);
            toast.success("Heatmap generated!");
        } else {
            throw new Error("No image data returned");
        }

    } catch (error) {
        console.error("Heatmap gen error:", error);
        toast.error("Failed to generate heatmap");
    } finally {
        setIsGeneratingHeatmap(false);
    }
  };


  const saveHeatmapResult = async () => {
    if (!selectedSsid || points.length === 0) return;
    setIsSaving(true);

    let totalRssi = 0;
    let count = 0;

    points.forEach(p => {
      const net = p.data?.find(n => n.ssid === selectedSsid);
      if (net) {
        totalRssi += net.rssi;
        count++;
      }
    });

    const avgRssi = count > 0 ? Math.round(totalRssi / count) : 0;
    const coveragePercent = Math.round((count / points.length) * 100);
    
    try {
      const mapElement = document.querySelector('.heatmap-workspace') as HTMLElement;
      let snapshotBase64 = null;

      if (mapElement) {
        const canvas = await html2canvas(mapElement, {
            useCORS: true,
            logging: false,
            scale: 1.5 
        });
        snapshotBase64 = canvas.toDataURL('image/jpeg', 0.8);
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      await fetch(`${API_URL}/api/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'heatmap',
          summary: `Heatmap: ${selectedSsid}`,
          details: {
            points_count: points.length,
            target_ssid: selectedSsid,
            avg_signal: avgRssi,
            coverage_percent: coveragePercent,
            coverage_quality: avgRssi > -65 ? 'Good' : 'Weak',
            snapshot: snapshotBase64
          }
        })
      });

      toast.success(t('heatmap.save_success') || "Heatmap saved successfully!");

    } catch (error) {
      console.error(error);
      toast.error("Failed to save heatmap");
    } finally {
      setIsSaving(false);
    }
  };

  return (
      <div className="heatmap-container">
        <div className="heatmap-toolbar">
          <Info size={20} className="banner-icon" />
          <div className="toolbar-left">
            <h3>{t('heatmap.coverage_mapper')}</h3>
            <p>{isScanningMode ? t('heatmap.scan_str') : t('heatmap.coverage_mapper_str')}</p>
          </div>
          
          <div className="toolbar-actions">
            {points.length > 0 && !isScanningMode && (
              <div className="network-selector">
                <Wifi size={16} className="selector-icon"/>
                <select 
                  value={selectedSsid} 
                  onChange={(e) => setSelectedSsid(e.target.value)}
                  className="ssid-select"
                >
                  <option value="" disabled>{t('heatmap.scan_select')}</option>
                  {availableNetworks.map(ssid => (
                    <option key={ssid} value={ssid}>{ssid}</option>
                  ))}
                </select>
              </div>
            )}

            {mapImage && !isScanningMode && (
              <button className="btn-danger-outline" onClick={handleClearMap} title="Clear Map">
                <Trash2 size={18} />
              </button>
            )}

            {!mapImage && (
              <button className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
                <Upload size={18} /> {t('heatmap.upload_plan')}
              </button>
            )}

            {mapImage && (
              <button 
                className={`btn-scan-toggle ${isScanningMode ? 'active' : ''}`} 
                onClick={toggleScanningMode}
                disabled={isSaving || isGeneratingHeatmap}
              >
                {isScanningMode ? (
                  <><Square size={18} fill="currentColor" /> {t('heatmap.scan_finish')}</>
                ) : (
                  <><Play size={18} fill="currentColor" /> {t('heatmap.scan')}</>
                )}
              </button>
            )}
            
            {mapImage && !isScanningMode && points.length >= 3 && selectedSsid && (
                <button 
                    className="btn-primary"
                    onClick={generateHeatmap}
                    disabled={isGeneratingHeatmap || isSaving}
                    title="Generate Overlay"
                >
                    {isGeneratingHeatmap ? <Loader2 size={18} className="spin" /> : <MapPin size={18} />}
                    {isGeneratingHeatmap ? 'Generating...' : 'Map Coverage'}
                </button>
            )}

            {mapImage && !isScanningMode && points.length > 0 && selectedSsid && (
              <button 
                className="btn-secondary" 
                onClick={saveHeatmapResult}
                disabled={isSaving || isGeneratingHeatmap}
                style={{display: 'flex', alignItems: 'center', gap: '8px'}}
              >
                {isSaving ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
                {t('heatmap.save_btn') || "Save"}
              </button>
            )}

            <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImageUpload}/>
          </div>
        </div>

        <Widget className="heatmap-workspace">
          {mapImage ? (
            <div className={`map-wrapper ${isScanningMode ? 'scanning-cursor' : ''}`} onClick={handleMapClick}>
              {/* Шар 1: План приміщення */}
              <img 
                ref={imageRef} 
                src={mapImage} 
                alt="Floor Plan" 
                className="floor-plan-img" 
              />
              
              {/* Шар 2: Згенерована Heatmap*/}
              {heatmapImage && (
                <img 
                    src={heatmapImage} 
                    alt="Heatmap Overlay" 
                    className="heatmap-overlay-img"
                    style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '100%', 
                        height: '100%', 
                        opacity: 0.6, 
                        pointerEvents: 'none' 
                    }} 
                />
              )}

              {/* Шар 3: Точки */}
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
                    {point.status === 'pending' && <Loader2 size={14} className="point-spinner" />}
                    
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
                <h4>{t('heatmap.no_floor')}</h4>
                <button className="btn-upload-big"><Plus size={20} /> {t('heatmap.upload_image')}</button>
              </div>
            </div>
          )}
        </Widget>

        <ConfirmModal 
          isOpen={modalConfig.isOpen}
          title={modalConfig.type === 'clear_map' ? (t('heatmap.clear_map_title') || "Clear Map?") : (t('heatmap.new_scan_title') || "Start New Scan?")}
          message={
              modalConfig.type === 'clear_map' 
              ? (t('heatmap.clear_map_msg') || "This will remove the current floor plan and all recorded data. This action cannot be undone.")
              : (t('heatmap.new_scan_msg') || "Starting a new scan will clear all current points. Do you want to continue?")
          }
          onConfirm={performConfirmedAction}
          onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })}
          isDangerous={true}
          confirmText={t('common.confirm') || "Confirm"}
          cancelText={t('common.cancel') || "Cancel"}
        />
      </div>
    );
};