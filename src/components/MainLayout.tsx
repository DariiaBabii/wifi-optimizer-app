// src/components/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar'; // Переконайтеся, що Navbar.tsx також експортується

// Стилі для об'єднання навігації та контенту
const layoutStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  height: '100vh',
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: '20px',
  overflowY: 'auto', // Додає прокрутку, якщо контент не вміщується
};

export const MainLayout = () => {
  return (
    <div style={layoutStyle}>
      <Navbar />
      <main style={contentStyle}>
        {/* Тут будуть рендеритись ваші сторінки */}
        <Outlet />
      </main>
    </div>
  );
};