import { Header } from '../../components/Header/Header';
import { Widget } from '../../components/Widget/Widget';
import { getGreeting } from '../../utils/timeHelpers';
import { NetworksListWidget } from '../../components/NetworksListWidget/NetworksListWidget';
import { SpeedtestWidget } from '../../components/Widget/SpeedtestWidget';
import './DashboardPage.css'; 

import { Bot } from 'lucide-react';

export const DashboardPage = () => {
  const greeting = getGreeting();

  const dashboardTitle = (
      <div>
        <h3>{greeting}</h3>
        <p className="network-status">
        Ready to analyze your Wi-Fi environment.
        </p>
        
      </div>
  );

  const aiButton = (
    <button className="ai-button">
      <Bot size={18} />
      <span>AI Assistant</span>
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
        <h4>Поточний Канал</h4>
        <p>6 (2.4 GHz)</p>
      </Widget>
      <Widget className="grid-stat-2">
        <h4>Інтерференція</h4>
        <p>Середня</p>
      </Widget>
      <Widget className="grid-stat-3">
        <h4>Сила Сигналу</h4>
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