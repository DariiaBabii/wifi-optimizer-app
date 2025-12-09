import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { useTranslation } from 'react-i18next';
import { Trash2, Wifi, Map, Activity, Clock, X, Calendar } from 'lucide-react';
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
      }
    } catch (error) {
      console.error("Failed to load history", error);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!confirm('Are you sure you want to clear all history?')) return;
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await fetch(`${API_URL}/api/history`, { method: 'DELETE' });
      setHistory([]); 
    } catch (error) {
      console.error("Failed to clear history", error);
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

  const handleItemClick = (item: HistoryItem) => {
    setSelectedItem(item);
  };

  const closeDrawer = () => setSelectedItem(null);


return (
    <div className="history-container">
      <Header title="History Log" />

      <div className="history-content">
        {!loading && history.length > 0 && (
          <div className="history-toolbar">
            <span className="total-count">Total records: {history.length}</span>
            <button className="clear-btn" onClick={clearHistory}>
              <Trash2 size={16} /> Clear History
            </button>
          </div>
        )}

        {loading ? (
          <div className="loading-state">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="empty-state-history">
            <Clock size={48} color="#cbd5e1" />
            <p>No history records found yet.</p>
          </div>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div 
                key={item.id} 
                className={`history-card ${selectedItem?.id === item.id ? 'active' : ''}`}
                onClick={() => handleItemClick(item)}
                style={{cursor: 'pointer'}}
              >
                
                <div className="card-left">
                  <div className={`icon-box ${item.type}`}>
                    {getIconByType(item.type)}
                  </div>
                </div>

                <div className="card-center">
                  <div className="card-header">
                    <span className="summary">{item.summary}</span>
                    <span className="timestamp">{formatDate(item.timestamp)}</span>
                  </div>
                  
                  <div className="card-details">
                    {item.type === 'scan' && (
                      <span>Networks found: <b>{item.details.networks_count}</b></span>
                    )}
                    {item.type === 'heatmap' && (
                      <span>Avg Signal: <b>{item.details.avg_signal} dBm</b></span>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {selectedItem && (
        <>
          {/* Затемнення фону */}
          <div className="drawer-overlay" onClick={closeDrawer} />
          
          {/* Сама панель */}
          <div className="history-drawer">
            <div className="drawer-header">
              <h3>{selectedItem.type.toUpperCase()} Details</h3>
              <button className="close-btn" onClick={closeDrawer}>
                <X size={24} />
              </button>
            </div>

            <div className="drawer-body">
              <div className="detail-row">
                <Calendar size={16} /> 
                <span>{formatDate(selectedItem.timestamp)}</span>
              </div>
              
              <h2 className="detail-title">{selectedItem.summary}</h2>

              {selectedItem.type === 'heatmap' && selectedItem.details.snapshot ? (
                <div className="heatmap-snapshot-container">
                  <img 
                    src={selectedItem.details.snapshot} 
                    alt="Heatmap Snapshot" 
                    className="heatmap-snapshot" 
                  />
                  <div className="heatmap-stats">
                     <div className="stat-box">
                       <span>Avg Signal</span>
                       <strong>{selectedItem.details.avg_signal} dBm</strong>
                     </div>
                     <div className="stat-box">
                       <span>Coverage</span>
                       <strong>{selectedItem.details.coverage_percent}%</strong>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="json-view">
                   <pre>{JSON.stringify(selectedItem.details, null, 2)}</pre>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};