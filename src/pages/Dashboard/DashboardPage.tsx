import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/Header/Header';
import { Widget } from '../../components/Widget/Widget';
import { getGreeting } from '../../utils/timeHelpers';
import { NetworksListWidget } from '../../components/NetworksListWidget/NetworksListWidget';
import { SpeedtestWidget } from '../../components/Widget/SpeedtestWidget';
import { useWifi } from '../../context/WifiContext';
import './DashboardPage.css'; 

import { Bot, BarChart3 } from 'lucide-react';

export const DashboardPage = () => {
  const { t } = useTranslation();
  const greeting = getGreeting();
  const { networks } = useWifi();

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
    if (rssi >= -50) return { label: 'Perfect', desc: 'Streaming 4K / Gaming' };
    if (rssi >= -65) return { label: 'Good', desc: 'HD Streaming / Work' };
    if (rssi >= -75) return { label: 'Fair', desc: 'Web Browsing' };
    return { label: 'Weak', desc: 'Unstable connection' };
  };

  const signalInfo = bestNetwork ? getSignalStatus(bestNetwork.rssi) : { label: '--', desc: 'No data' };

  const dashboardTitle = (
      <div>
        <h3>{greeting}</h3>
        <p className="network-status">
        {t('dashboard.status_ready')}
        </p>
        
      </div>
  );

  const aiButton = (
    <button className="ai-button">
      <Bot size={18} style={{ marginRight: '8px' }} />
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
                <div className="health-bar-fill" style={{ width: `${healthScore}%`, background: healthScore > 70 ? '#10b981' : '#f59e0b' }}></div>
            </div>
            <p className="kpi-desc">Based on signal & interference</p>
        </div>
      </Widget>
      <Widget className="grid-stat-3 kpi-widget">
        <div className="kpi-header">
            <div className="icon-bg green"><BarChart3 size={20} /></div>
            <h4>{t('dashboard.signal')}</h4>
        </div>
        <div className="kpi-content">
          <div className="kpi-content3">

            <div className="kpi-main-value">
                {bestNetwork ? bestNetwork.rssi : '--'} 
                <span className="kpi-unit">dBm</span>
            </div>
            <div className="signal-badge">
                <strong>{signalInfo.label}</strong>
            </div>
          </div>
          
            <p className="kpi-desc">{signalInfo.desc}</p>
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