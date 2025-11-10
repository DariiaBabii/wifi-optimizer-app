import { NavLink, Outlet } from 'react-router-dom';
import './DiagnosticsPage.css';

export const DiagnosticsPage = () => {
  return (
    <div className="diagnostics-container">
      <h2>Diagnostics</h2>
      <p>Analyze your Wi-Fi environment</p>
      
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