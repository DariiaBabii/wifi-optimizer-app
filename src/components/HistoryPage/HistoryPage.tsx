import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast'; 
import { Header } from '../../components/Header/Header';
import { useTranslation } from 'react-i18next';
import { Trash2, Wifi, Map, Activity, Clock, Calendar, ImageIcon } from 'lucide-react';
import { ConfirmModal } from '../../components/Modal/ConfirmModal'; 
import './HistoryPage.css';

interface HistoryDetail {
  [key: string]: any; 
}

interface HistoryItem {
  id: string;
  timestamp: string;
  type: 'scan' | 'heatmap' | 'speedtest';
  summary: string;
  details: HistoryDetail;
}

export const HistoryPage = () => {
  const { t } = useTranslation();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  
  // Стан для модального вікна видалення
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // Завантаження історії
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/history`);
      const data = await res.json();
      
      if (data.success) {
        setHistory(data.data);
        if (data.data.length > 0) setSelectedItem(data.data[0]);
      }
    } catch (error) {
      console.error("Failed to load history", error);
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const handleClearClick = () => {
    setDeleteModalOpen(true);
  };

  const confirmClearHistory = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await fetch(`${API_URL}/api/history`, { method: 'DELETE' });
      setHistory([]); 
      setSelectedItem(null);
      toast.success("History cleared successfully");
    } catch (error) {
      console.error("Failed to clear history", error);
      toast.error("Failed to clear history");
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const getIconByType = (type: string) => {
    switch (type) {
      case 'scan': return <Wifi size={20} color="#3b82f6" />;
      case 'heatmap': return <Map size={20} color="#f59e0b" />;
      case 'speedtest': return <Activity size={20} color="#10b981" />;
      default: return <Clock size={20} color="#64748b" />;
    }
  };
  
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('uk-UA', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  };

  const getSignalColor = (rssi: number) => {
    if (rssi >= -50) return '#10b981'; 
    if (rssi >= -60) return '#3b82f6'; 
    if (rssi >= -70) return '#f59e0b'; 
    return '#ef4444'; 
  };

  return (
    <div className="history-container">
      <Header title="History Log" />

      <div className="history-layout">
        
        {/* --- ЛІВА КОЛОНКА: СПИСОК --- */}
        <div className="history-list-column">
          
          <div className="list-toolbar">
             <span className="total-count">Records: {history.length}</span>
             {history.length > 0 && (
                <button className="clear-text-btn" onClick={handleClearClick}>
                  Clear All
                </button>
             )}
          </div>

          {loading ? (
            <div className="loading-state">Loading...</div>
          ) : history.length === 0 ? (
            <div className="empty-state-history">
              <Clock size={48} color="#cbd5e1" />
              <p>No records yet.</p>
            </div>
          ) : (
            <div className="list-scroll-area">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className={`history-card-compact ${selectedItem?.id === item.id ? 'active' : ''}`}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className={`icon-box-small ${item.type}`}>
                    {getIconByType(item.type)}
                  </div>
                  <div className="card-content">
                    <div className="card-top">
                      <span className="summary-text">{item.summary}</span>
                      <span className="time-text">{formatDate(item.timestamp).split(',')[1]}</span>
                    </div>
                    <div className="card-bottom">
                       <span className="date-text">{formatDate(item.timestamp).split(',')[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- ПРАВА КОЛОНКА: ДЕТАЛІ --- */}
        <div className="history-detail-column">
          {selectedItem ? (
            <div className="detail-panel">
              <div className="detail-header">
                <div className={`detail-icon-large ${selectedItem.type}`}>
                   {getIconByType(selectedItem.type)}
                </div>
                <div>
                  <h2>{selectedItem.summary}</h2>
                  <span className="detail-date">
                    <Calendar size={14} style={{marginRight: 4}}/> 
                    {formatDate(selectedItem.timestamp)}
                  </span>
                </div>
              </div>

              <div className="detail-body">
                {/* ВІДОБРАЖЕННЯ HEATMAP */}
                {selectedItem.type === 'heatmap' ? (
                  <div className="heatmap-view">
                    {selectedItem.details.snapshot ? (
                      <div className="image-container">
                        <img 
                          src={selectedItem.details.snapshot} 
                          alt="Heatmap" 
                          className="heatmap-img"
                        />
                      </div>
                    ) : (
                      <div className="no-image-placeholder">
                        <ImageIcon size={48} color="#cbd5e1"/>
                        <p>No visual snapshot available for this record.</p>
                      </div>
                    )}
                    
                    <div className="stats-grid">
                       <div className="stat-card">
                         <label>Avg Signal</label>
                         <strong>{selectedItem.details.avg_signal} dBm</strong>
                       </div>
                       <div className="stat-card">
                         <label>Coverage</label>
                         <strong>{selectedItem.details.coverage_percent}%</strong>
                       </div>
                       <div className="stat-card">
                         <label>Points</label>
                         <strong>{selectedItem.details.points_count}</strong>
                       </div>
                       <div className="stat-card">
                         <label>Quality</label>
                         <strong className={`quality-${selectedItem.details.coverage_quality?.toLowerCase()}`}>
                           {selectedItem.details.coverage_quality}
                         </strong>
                       </div>
                    </div>
                  </div>
                ) : selectedItem.type === 'scan' ? (

                  <div className="scan-detail-view">
                    
                    {/* Верхні картки зі статистикою */}
                    <div className="scan-stats-row">
                      <div className="stat-card">
                        <label>Total Networks</label>
                        <strong>{selectedItem.details.networks_count}</strong>
                      </div>
                      <div className="stat-card">
                        <label>Best Network</label>
                        <strong className="text-truncate">{selectedItem.details.top_network}</strong>
                      </div>
                    </div>

                    <h4 className="section-title">Top 5 Strongest Networks</h4>

                    {/* Список мереж */}
                    <div className="scan-networks-list">
                      {selectedItem.details.top_5_networks?.map((net: any, index: number) => (
                        <div key={index} className="network-history-item">
                          
                          <div className="net-main-info">
                            <span className="net-ssid">{net.ssid || '(Hidden Network)'}</span>
                            <span className="net-bssid">{net.bssid}</span>
                          </div>

                          <div className="net-tech-info">
                            <span className="net-badge channel">Ch {net.channel}</span>
                            <span className="net-badge band">{net.band} GHz</span>
                          </div>

                          <div className="net-signal">
                            <span style={{ color: getSignalColor(net.rssi), fontWeight: 'bold' }}>
                              {net.rssi} dBm
                            </span>
                            <div className="signal-bar-mini">
                              <div 
                                style={{ 
                                  width: `${Math.min(100, Math.max(0, (net.rssi + 100) * 2))}%`, 
                                  backgroundColor: getSignalColor(net.rssi) 
                                }} 
                              />
                            </div>
                          </div>
                          
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="json-view">
                     <pre>{JSON.stringify(selectedItem.details, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="empty-detail-state">
              <div className="select-prompt">
                <Clock size={64} color="#e2e8f0" />
                <h3>Select an item to view details</h3>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
         isOpen={isDeleteModalOpen}
         title="Clear all history?"
         message="Are you sure you want to delete all scan records? This action cannot be undone."
         onConfirm={confirmClearHistory}
         onCancel={() => setDeleteModalOpen(false)}
         isDangerous={true}
         confirmText="Delete All"
       />
    </div>
  );
};