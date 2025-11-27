import { useTranslation } from 'react-i18next';
import { Header } from '../../components/Header/Header';
import { Widget } from '../../components/Widget/Widget';
import { getGreeting } from '../../utils/timeHelpers';
import { NetworksListWidget } from '../../components/NetworksListWidget/NetworksListWidget';
import { SpeedtestWidget } from '../../components/Widget/SpeedtestWidget';
import './DashboardPage.css'; 

import { Bot } from 'lucide-react';

export const DashboardPage = () => {
  const { t } = useTranslation();
  const greeting = getGreeting();

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
      <Widget className="grid-stat-1">
        <h4>{t('dashboard.channel')}</h4>
        <p>6 (2.4 GHz)</p>
      </Widget>
      <Widget className="grid-stat-2">
        <h4>{t('dashboard.interference')}</h4>
        <p>Medium</p>
      </Widget>
      <Widget className="grid-stat-3">
        <h4>{t('dashboard.signal')}</h4>
        <p>-50 dBm</p>
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