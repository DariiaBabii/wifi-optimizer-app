import { Header } from '../../components/Header/Header';
import './HistoryPage.css';

export const HistoryPage = () => {
  return (
    <div className="history-container">
     <Header title="History" />

      {/* Контент вкладок (ScanPage або HeatmapPage)
        <div className="tab-content" key={location.pathname}>
        <Outlet /> */}
      </div>
  );
};