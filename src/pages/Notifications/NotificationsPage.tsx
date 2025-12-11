import React, { useEffect, useState } from 'react';
import { Header } from '../../components/Header/Header';
import { Trash2, CheckCircle, Bell, AlertTriangle, Shield, Wifi, Globe, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';
import './NotificationsPage.css';

interface Notification {
  id: string;
  timestamp: string;
  category: string;
  event: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  read: boolean;
}

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/notifications`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Позначаємо як прочитані при відкритті ??
    // markAsRead(); 
  }, []);

  const clearAll = async () => {
    if(!confirm("Clear all logs?")) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await fetch(`${API_URL}/api/notifications`, { method: 'DELETE' });
      setNotifications([]);
      toast.success("Logs cleared");
    } catch (e) { toast.error("Failed to clear"); }
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  // Компонент для смужок важливості
  const SeverityBars = ({ level }: { level: string }) => {
    const getColor = () => {
      if (level === 'critical') return '#ef4444'; 
      if (level === 'warning') return '#f59e0b';
      return '#10b981'; 
    };
    
    // 4 смужки
    return (
      <div className="severity-indicator">
        {[1, 2, 3, 4].map(i => (
          <div 
            key={i} 
            className="sev-bar" 
            style={{ 
              backgroundColor: getColor(),
              opacity: level === 'info' && i > 2 ? 0.3 : 1 
            }} 
          />
        ))}
      </div>
    );
  };

  const getCategoryIcon = (cat: string) => {
    if (cat.includes("Internet")) return <Globe size={16} />;
    if (cat.includes("Wi-Fi")) return <Wifi size={16} />;
    if (cat.includes("Security")) return <Shield size={16} />;
    return <Cpu size={16} />;
  };

  return (
    <div className="notifications-container">
      <Header title="System Logs" />
      
      <div className="notifications-content">
        <div className="notif-toolbar">
          <span className="count-badge">{notifications.length} Events</span>
          {notifications.length > 0 && (
            <button className="clear-logs-btn" onClick={clearAll}>
              Clear All
            </button>
          )}
        </div>

        <div className="logs-table-wrapper">
          <div className="logs-header-row">
            <div className="col col-cat">Category</div>
            <div className="col col-event">Event</div>
            <div className="col col-desc">Description</div>
            <div className="col col-sev">Severity</div>
            <div className="col col-date">Date / Time</div>
          </div>

          <div className="logs-body">
            {notifications.length === 0 ? (
              <div className="empty-logs">
                <CheckCircle size={32} color="#77879cff" />
                <p>No system events recorded.</p>
              </div>
            ) : (
              notifications.map(item => (
                <div key={item.id} className={`log-row ${item.read ? '' : 'unread'}`}>
                  
                  <div className="col col-cat">
                    <span className="cat-badge">
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </span>
                  </div>

                  <div className="col col-event">
                    <strong>{item.event}</strong>
                  </div>

                  <div className="col col-desc">
                    {item.description}
                  </div>

                  <div className="col col-sev">
                    <SeverityBars level={item.severity} />
                  </div>

                  <div className="col col-date">
                    {formatDate(item.timestamp)}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};