import React, { useState, useMemo } from 'react'; 
import { Widget } from '../../components/Widget/Widget';
import './ScanPage.css';
import { Wifi, ChevronUp, ChevronDown, Loader2, Info } from 'lucide-react';
import { useWifi, type WifiNetwork } from '../../context/WifiContext';
import { useSettings } from '../../context/SettingsContext';

// Тип для ключів, за якими можна сортувати
type SortKey = keyof WifiNetwork;

export const ScanPage = () => {
  const { networks, loading, error, scanNetworks } = useWifi();
  const { settings } = useSettings();

  const formatDistance = (meters: number) => {
  if (meters < 1) return meters.toFixed(1); // 0.5 m
  return Math.round(meters); // 5 m, 12 m
  };

  // Стан для сортування
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'rssi',
    direction: 'desc', // Спочатку найсильніші
  });
  const filteredNetworks = networks.filter(n => n.rssi >= settings.signalThreshold);

  // Функція для зміни сортування
  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // Сортування списку
  const sortedNetworks = useMemo(() => {
    const sorted = [...filteredNetworks];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Обробка рядків
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      // Обробка чисел
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue 
          : bValue - aValue;
      }
      return 0;
    });
    return sorted;
  }, [filteredNetworks, sortConfig]);

  const SortableHeader = ({ label, sortKey }: { label: string; sortKey: SortKey }) => {
    const isActive = sortConfig.key === sortKey;
    
    return (
      <th onClick={() => handleSort(sortKey)} className="sortable-th">
        <div className="th-content">
          {label}
          <span className={`sort-icon ${isActive ? 'active' : ''}`}>
            {isActive && sortConfig.direction === 'desc' ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronUp size={14} className={isActive ? '' : 'ghost-icon'} />
            )}
          </span>
        </div>
      </th>
    );
  };

  return (
    <div className="scan-page-container">
      
      <div className="scan-info-banner">
        <Info size={20} className="banner-icon" />
        <div className="banner-text">
          <h3>Network Scanner</h3>
          <p>Find the best channel for your router by scanning neighboring networks.</p>
        </div>
        <div className="scan-button-wrapper">
              <button 
              
                className={`scan-button ${loading ? 'loading' : ''}`} 
                onClick={scanNetworks} 
                disabled={loading}
              >
                <Wifi className="scan-icon" size={24} />
                <span className="scan-text">{loading ? 'Scanning...' : 'Scan network'}</span>
              </button>
        </div>
      </div>

      {error && (
        <div className="scan-error"><strong>Error:</strong> {error}</div>
      )}

      <Widget className="scan-table-widget">
        <div className="widget-toolbar">
          {/* Зліва: Заголовок і лічильник */}
          <div className="toolbar-title">
            <h4>Discovered Networks:</h4>
            <span className="network-count-badge">{sortedNetworks.length}</span>
          </div>
        

        </div>

        <div className="table-container">
          <table className="scan-table">
            <thead>
              <tr className="sortable-header">
                <SortableHeader label="SSID" sortKey="ssid" />
                <SortableHeader label="Vendor" sortKey="vendor" />
                <SortableHeader label="Channel" sortKey="channel" />
                <SortableHeader label="Frequency range (GHz)" sortKey="band" />
                <SortableHeader label="RSSI (dBm)" sortKey="rssi" />
                <SortableHeader label="Quality" sortKey="quality" />
                <SortableHeader label="Security" sortKey="security" />              
                <SortableHeader label="Distance (m)" sortKey="distance" />
              </tr>
            </thead>
            <tbody>
              {loading && (
                 <tr><td colSpan={8} className="table-message">Scanning...</td></tr>
              )}
              
              {!loading && sortedNetworks.length > 0 && (
                sortedNetworks.map((network) => (
                  <tr key={network.bssid}>
                    {/* SSID */}
                    <td>
                      {network.ssid ? (
                        <span className="ssid-text">{network.ssid}</span>
                      ) : (
                        <span className="hidden-ssid">
                          Hidden <span className="bssid-hint">({network.bssid})</span>
                        </span>
                      )}
                    </td>

                    {/* Vendor*/}
                    <td style={{ color: '#888', fontSize: '0.9em' }}>
                      {network.vendor || 'Unknown'}
                    </td>

                    {/* Channel */}
                    <td>{network.channel}</td>

                    {/* Band */}
                    <td>{network.band}</td>

                    {/* RSSI */}
                    <td className={network.rssi > -60 ? 'signal-good' : network.rssi > -80 ? 'signal-mid' : 'signal-bad'}>
                      {network.rssi}
                    </td>

                    {/* Quality*/}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ minWidth: '30px', fontSize: '0.9em' }}>{network.quality}%</span>
                        <div style={{ 
                          width: '60px', height: '4px', background: '#eee', borderRadius: '2px' 
                        }}>
                          <div style={{ 
                            width: `${network.quality}%`, 
                            height: '100%', 
                            background: network.quality > 70 ? '#4cd137' : network.quality > 40 ? '#fbc531' : '#e84118',
                            borderRadius: '2px'
                          }} />
                        </div>
                      </div>
                    </td>

                    <td>{network.security}</td>

                    <td>{formatDistance(network.distance)}</td>
                  </tr>
                ))
              )}
              
              {!loading && !error && sortedNetworks.length === 0 && (
                <tr><td colSpan={8} className="table-message">No data found. Please run a scan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Widget>
    </div>
  );
};