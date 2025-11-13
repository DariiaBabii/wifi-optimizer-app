// src/components/Navbar.tsx
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Bot, 
  History,
  Wifi,
  Bell,    
  Settings
} from 'lucide-react';
import './Navbar.css'; 

export const Navbar = () => {
  return (
    <nav className="main-nav">

      <div className="nav-top">
        <div className="nav-logo">
          <Wifi size={28} />
        </div>

        <ul className="nav-list">
          <li>
            <NavLink to="/" className="nav-link">
              <LayoutDashboard size={20} />
              <span className="nav-tooltip">Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/diagnostics" className="nav-link">
              <Activity size={20} />
              <span className="nav-tooltip">Diagnostics</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/assistant" className="nav-link">
              <Bot size={20} />
              <span className="nav-tooltip">Assistant</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/history" className="nav-link">
              <History size={20} />
              <span className="nav-tooltip">History</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="nav-bottom">
        <ul className="nav-list">
          <li>
            <NavLink to="/notifications" className="nav-link">
              <Bell size={20} />
              <span className="nav-tooltip">Notifications</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className="nav-link">
              <Settings size={20} />
              <span className="nav-tooltip">Settings</span>
            </NavLink>
          </li>
        </ul>
      </div>

    </nav>
  );
};