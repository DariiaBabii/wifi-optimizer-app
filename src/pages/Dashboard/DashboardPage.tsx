// src/pages/DashboardPage.tsx
import { Widget } from '../../components/Widget';
import './DashboardPage.css'; 

export const DashboardPage = () => {
  return (
    <div className="dashboard-grid">

      {/* Зона 1: Заголовок */}
      <Widget className="grid-header">
        <h3>Good morning, user!</h3>
        <p>Network status: All is well.</p>
        {/* тут буде кнопка */}
      </Widget>

      {/* Зона 2: Ключові Метрики */}
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

      {/* Зона 3: Основний Контент */}
      <Widget className="grid-main-chart">
        <h4>Огляд Продуктивності</h4>
        {/* Тут буде графік */}
      </Widget>
      <Widget className="grid-sidebar">
        <h4>Мережі Поруч</h4>
        {/* Тут буде список */}
      </Widget>

    </div>
  );
};