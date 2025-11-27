// src/components/Navbar.tsx
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Activity, 
  Bot, 
  History,
  Bell,    
  Settings
} from 'lucide-react';
import './Navbar.css'; 

export const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="navbar main-nav">

      <div className="nav-top">
        <div className="nav-logo">
          <img 
            src="https://img.icons8.com/external-others-inmotus-design/67/external-WiFi-contour-others-inmotus-design-2.png" 
            alt="Wi-Fi Advisor Logo" 
            className="logo-img"
          />
        </div>

        <ul className="nav-list">
          <li>
            <NavLink to="/" className="nav-link">
              <LayoutDashboard size={20} />
              <span className="nav-tooltip">{t('nav.dashboard')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/diagnostics" className="nav-link">
              <Activity size={20} />
              <span className="nav-tooltip">{t('nav.diagnostics')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/assistant" className="nav-link">
              <Bot size={20} />
              <span className="nav-tooltip">{t('nav.assistant')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/history" className="nav-link">
              <History size={20} />
              <span className="nav-tooltip">{t('nav.history')}</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="nav-bottom">
        <ul className="nav-list">
          <li>
            <NavLink to="/notifications" className="nav-link">
              <Bell size={20} />
              <span className="nav-tooltip">{t('nav.notifications')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className="nav-link">
              <Settings size={20} />
              <span className="nav-tooltip">{t('nav.settings')}</span>
            </NavLink>
          </li>
        </ul>
      </div>

    </nav>
  );
};