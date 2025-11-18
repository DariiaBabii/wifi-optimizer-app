import { Widget } from '../../components/Widget';
import { getGreeting } from '../../utils/timeHelpers';
import { NetworksListWidget } from '../../components/NetworksListWidget/NetworksListWidget';
import './DashboardPage.css'; 

export const DashboardPage = () => {
  const greeting = getGreeting();

  return (
    <div className="dashboard-grid">

      {/* Header */}
      <Widget className="grid-header">
        <div>
        <h3>{greeting}, User!</h3>
        <p>Network status: All is well.</p>
        </div>

        <button className="ai-button">
          AI Assistant
        </button>
      </Widget>

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

      {/* General Content */}
      <Widget className="grid-main-chart">
        <h4>Огляд Продуктивності</h4>
        {/* Тут буде графік */}
      </Widget>
      <Widget className="grid-sidebar">
        <div className="grid-sidebar">
          <NetworksListWidget />
        </div>
      </Widget>

    </div>
  );
};