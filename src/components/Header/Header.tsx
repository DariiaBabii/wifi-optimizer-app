import React from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext'
import './Header.css';

interface Tab {
  label: string;
  path: string;
}

interface HeaderProps {
  title: string;
  tabs?: Tab[];
}

export const Header = ({ title, tabs }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-left">
        <h1 className="page-title">{title}</h1>
        
        {/* Рендеримо вкладки, якщо вони передані */}
        {tabs && (
          <nav className="header-tabs">
            {tabs.map((tab) => (
              <NavLink key={tab.path} to={tab.path} end>
                {tab.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>

      <div className="header-right">
        <button className="theme-toggle" onClick={toggleTheme} title="Change theme">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
};