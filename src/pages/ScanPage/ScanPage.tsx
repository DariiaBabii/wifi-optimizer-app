import React, { useState, useMemo } from 'react'; 
import { useTranslation } from 'react-i18next';
import { Widget } from '../../components/Widget/Widget';
import './ScanPage.css';
import { Wifi, ChevronUp, ChevronDown, Loader2, Info } from 'lucide-react';
import { useWifi, type WifiNetwork } from '../../context/WifiContext';
import { useSettings } from '../../context/SettingsContext';

type SortKey = keyof WifiNetwork;

export const ScanPage = () => {
  const { t } = useTranslation();
  const { networks, loading, error, scanNetworks } = useWifi();
  const { settings } = useSettings();

  const formatDistance = (meters: number) => {
    if (meters < 1) return meters.toFixed(1); 
    return Math.round(meters);
  };

  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({
    key: 'rssi',
    direction: 'desc',
  });
  
  const filteredNetworks = networks.filter(n => n.rssi >= settings.signalThreshold);

  const handleSort = (key: SortKey) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedNetworks = useMemo(() => {
    const sorted = [...filteredNetworks];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
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
          <h3>{t('scanner.title')}</h3>
          <p>{t('scanner.desc')}</p>
        </div>
        <div className="scan-button-wrapper">
              <button 
                className={`scan-button ${loading ? 'loading' : ''}`} 
                onClick={scanNetworks} 
                disabled={loading}
              >
                <Wifi className="scan-icon" size={24} />
                <span className="scan-text">
                    {loading ? t('scanner.btn_scanning') : t('scanner.btn_start')}
                </span>
              </button>
        </div>
      </div>

      {error && (
        <div className="scan-error"><strong>Error:</strong> {error}</div>
      )}

      <Widget className="scan-table-widget">
        <div className="widget-toolbar">
          <div className="toolbar-title">
            <h4>{t('scanner.networks')}</h4>
            <span className="network-count-badge">{sortedNetworks.length}</span>
          </div>
        </div>

        <div className="table-container">
          <table className="scan-table">
            <thead>
              <tr className="sortable-header">
                <SortableHeader label={t('scanner.table_ssid')} sortKey="ssid" />
                <SortableHeader label={t('scanner.table_vendor')} sortKey="vendor" />
                <SortableHeader label={t('scanner.table_channel')} sortKey="channel" />
                <SortableHeader label={t('scanner.table_frq')} sortKey="band" />
                <SortableHeader label={t('scanner.table_rssi')} sortKey="rssi" />
                <SortableHeader label={t('scanner.table_quality')} sortKey="quality" />
                <SortableHeader label={t('scanner.table_security')} sortKey="security" />              
                <SortableHeader label={t('scanner.table_distance')} sortKey="distance" />
              </tr>
            </thead>
            <tbody>
              {loading && (
                 <tr><td colSpan={8} className="table-message">{t('scanner.btn_scanning')}</td></tr>
              )}
              
              {!loading && sortedNetworks.length > 0 && (
                sortedNetworks.map((network) => (
                  <tr key={network.bssid}>
                    <td>
                      {network.ssid ? (
                        <span className="ssid-text">{network.ssid}</span>
                      ) : (
                        <span className="hidden-ssid">
                          {t('scanner.table_hidden')} <span className="bssid-hint">({network.bssid})</span>
                        </span>
                      )}
                    </td>

                    <td style={{ color: '#888', fontSize: '0.9em' }}>
                      {network.vendor || t('scanner.table_unknown')}
                    </td>

                    <td>{network.channel}</td>

                    <td>{network.band}</td>

                    <td className={network.rssi > -60 ? 'signal-good' : network.rssi > -80 ? 'signal-mid' : 'signal-bad'}>
                      {network.rssi}
                    </td>

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
                <tr><td colSpan={8} className="table-message">{t('scanner.table_no_data')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Widget>
    </div>
  );
};