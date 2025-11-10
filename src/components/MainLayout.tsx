// src/components/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar'; 

// Стилі для об'єднання навігації та контенту
const layoutStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  height: '100vh',
};

const contentStyle: React.CSSProperties = {
  flex: 1,
  padding: 'var(--content-padding)',
  overflowY: 'auto',
};

export const MainLayout = () => {
  return (
    <div style={layoutStyle}>
      <Navbar />
      <main style={contentStyle}>
        {/* Тут будуть рендеритись сторінки */}
        <Outlet />
      </main>
    </div>
  );
};