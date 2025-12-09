import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns'; 
import { uk, enUS } from 'date-fns/locale';
import { Header } from '../../components/Header/Header';
import { Widget } from '../../components/Widget/Widget';
import { getGreetingKey } from '../../utils/timeHelpers';
import { NetworksListWidget } from '../../components/NetworksListWidget/NetworksListWidget';
import { SpeedtestWidget } from '../../components/Widget/SpeedtestWidget';
import { useWifi } from '../../context/WifiContext';
import { useSettings } from '../../context/SettingsContext';
import './DashboardPage.css'; 

export const DashboardPage = () => {
  const { t } = useTranslation();
  const greetingKey = getGreetingKey();
  const { networks, lastUpdated } = useWifi();
  const { settings } = useSettings();

  const navigate = useNavigate();

  const bestNetwork = useMemo(() => {
    if (networks.length === 0) return null;
    return networks.reduce((prev, current) => (prev.rssi > current.rssi) ? prev : current);
  }, [networks]);

  const channelCongestion = useMemo(() => {
    if (!bestNetwork) return 0;
    return networks.filter(n => n.channel === bestNetwork.channel && n.bssid !== bestNetwork.bssid).length;
  }, [networks, bestNetwork]);

  const healthScore = useMemo(() => {
    if (!bestNetwork) return 0;
    let score = 100;
    
    if (bestNetwork.rssi < -60) score -= 20;
    if (bestNetwork.rssi < -80) score -= 40;
    
    score -= (channelCongestion * 10); 
    
    return Math.max(0, score);
  }, [bestNetwork, channelCongestion]);

  const getSignalStatus = (rssi: number) => {
    if (rssi >= -50) return { label: 'Perfect', level: 4, color: '#47ba8aff' }; 
    if (rssi >= -65) return { label: 'Good',    level: 3, color: '#007bff' };
    if (rssi >= -75) return { label: 'Fair',    level: 2, color: '#f59e0b' };
    return {                  label: 'Weak',    level: 1, color: '#ef4444' };
  };

  const signalInfo = bestNetwork 
    ? getSignalStatus(bestNetwork.rssi) 
    : { label: '--', level: 0, color: '#cccccc' };



    const renderStatus = () => {
    if (!lastUpdated || networks.length === 0) {
      return (
        <span style={{ color: '#fcb74fff' }}>
           ● {t('dashboard.status_no_data')}
        </span>
      );
    }

    const dateLocale = settings.language === 'ua' ? uk : enUS;

  const timeAgo = formatDistanceToNow(new Date(lastUpdated), { 
      addSuffix: true, 
      locale: dateLocale 
    });

  return (
      <span style={{ color: '#099158a7' }}>
        ● {t('dashboard.status_updated')} {timeAgo}
      </span>
    );
  };

  const dashboardTitle = (
      <div>
        <h3>{t(greetingKey)}</h3>
        <p className="network-status">
          {renderStatus()}
        </p>
      </div>
  );

  const aiButton = (
    <button className="ai-button"
      onClick={() => navigate('/assistant')} >
      <span>{t('nav.assistant')}</span>
    </button>
  );

  return (
    <div className="dashboard-page">

      <Header 
        title={dashboardTitle} 
        actions={aiButton} 
      />

      <div className="dashboard-grid">
      {/* Metrics */}
      <Widget className="grid-stat-1 kpi-widget">
        <div className="kpi-header">
            <h4>{t('dashboard.channel')}</h4>
        </div>
        <div className="kpi-content">
            <div className="kpi-main-value">
                {bestNetwork ? bestNetwork.channel : '--'}
                <span className="kpi-sub"> {bestNetwork?.band || ''} GHz</span>
            </div>
            <p className={`kpi-desc ${channelCongestion > 2 ? 'warning' : 'success'}`}>
                {channelCongestion === 0 
                  ? 'Clean channel' 
                  : `${channelCongestion} networks overlapping`}
            </p>
        </div>
      </Widget>
      <Widget className="grid-stat-2 kpi-widget">
        <div className="kpi-header">
            <h4>Wi-Fi Health</h4>
        </div>
        <div className="kpi-content">
            <div className="kpi-main-value">
                {bestNetwork ? healthScore : '--'}
                <span className="kpi-unit">%</span>
            </div>
            <div className="health-bar-bg">
                <div className="health-bar-fill" style={{ width: `${healthScore}%`, background: healthScore > 70 ? '#10b981' : '#f8e111ff' }}></div>
            </div>
            <p className="kpi-desc">{t('dashboard.health')}</p>
        </div>
      </Widget>
      <Widget className="grid-stat-3 kpi-widget">
        <div className="kpi-header">
            <h4>{t('dashboard.signal')}</h4>
        </div>
        <div className="kpi-content">
          <div className="kpi-content3">

            <div className="kpi-main-value">
                {bestNetwork ? bestNetwork.rssi : '--'} 
                <span className="kpi-unit">dBm</span>
            </div>
            <div 
            className="signal-badge" 
            style={{ 
                color: signalInfo.color, 
                backgroundColor: `${signalInfo.color}15` 
            }} >
                <strong>{signalInfo.label}</strong>
            </div>
            </div>
            <div className="signal-bars-container">
            {[1, 2, 3, 4].map((bar) => (
              <div 
                key={bar} 
                className="signal-bar-segment"
                style={{ 
                  backgroundColor: bar <= signalInfo.level ? signalInfo.color : '#e5e7eb' 
                }}
              />
            ))}
            </div>
        </div>
      </Widget>

      <SpeedtestWidget className="grid-main-chart" />
      <Widget className="grid-sidebar">
        <div>
          <NetworksListWidget />
        </div>
      </Widget>
      </div>
    </div>
  );
};