import { NavLink, Outlet } from 'react-router-dom';
import './DiagnosticsPage.css';

export const DiagnosticsPage = () => {
  return (
    <div className="diagnostics-container">
      <div className="diagnostics-title">
      <h2>Analyze your Wi-Fi environment</h2>
      </div>

      {/* Навігація для вкладок */}
      <nav className="tabs">
        <NavLink to="scan">Scan</NavLink>
        <NavLink to="heatmap">Heatmap</NavLink>
      </nav>

      {/* Контент вкладок (ScanPage або HeatmapPage) */}
      <div className="tab-content">
        <Outlet />
      </div>
    </div>
  );
};