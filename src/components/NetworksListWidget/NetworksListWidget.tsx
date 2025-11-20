import React from 'react';
import { Link } from 'react-router-dom';
import { Wifi, AlertCircle } from 'lucide-react';
import { Widget } from '../Widget';
import { useWifi } from '../../context/WifiContext';
import './NetworksListWidget.css';

export const NetworksListWidget = () => {
  const { networks, loading } = useWifi();

  // Сортуємо: спочатку найсильніші сигнали
  const sortedNetworks = [...networks]
    .sort((a, b) => b.rssi - a.rssi)
    .slice(0, 5); // Беремо тільки топ-10

  // === EMPTY STATE ===
  if (networks.length === 0 && !loading) {
    return (
      <Widget className="networks-widget empty-state">
        <div className="empty-content">
          <AlertCircle size={40} className="empty-icon" />
          <h4>Дані відсутні</h4>
          <p>Please scan the network for interference.</p>
          <Link to="/diagnostics/scan" className="scan-link-btn">
            Go to scanner
          </Link>
        </div>
      </Widget>
    );
  }

  return (
    <Widget className="networks-widget">
      <div className="widget-header">
        <h3>Neighboring Networks</h3>
        <span className="badge">{networks.length}</span>
      </div>
      
      <div className="networks-list-scroll">
        {sortedNetworks.map((net) => {
          // Проста логіка "загрози" (пізніше замінити на справжній аналіз)
          const isStrong = net.rssi > -60; 
          
          return (
            <div key={net.bssid} className="network-row">
              <div className={`network-icon ${isStrong ? 'danger' : 'safe'}`}>
                <Wifi size={18} />
              </div>
              
              <div className="network-info">
                <span className="network-ssid">{net.ssid || '(Прихована)'}</span>
                <span className="network-meta">
                  Ch: <span className="mono-text">{net.channel}</span>
                </span>
              </div>

              <div className="network-signal">
                <span className="mono-text">{net.rssi} dBm</span>
                <div className="signal-bar-bg">
                  <div 
                    className="signal-bar-fill" 
                    style={{ 
                      width: `${Math.min(100, Math.max(0, (100 + net.rssi) * 2))}%`,
                      backgroundColor: isStrong ? '#ff4d4d' : '#4cd137'
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Widget>
  );
};