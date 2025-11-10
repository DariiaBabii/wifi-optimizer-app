// src/components/Navbar.tsx
import { NavLink } from 'react-router-dom';
import './Navbar.css'; 

export const Navbar = () => {
  return (
    <nav className="main-nav">
      <h2>Wi-Fi Оптимізатор</h2>
      <ul>
        <li><NavLink to="/">Dashboard</NavLink></li>
        <li><NavLink to="/diagnostics">Diagnostics</NavLink></li>
        <li><NavLink to="/assistant">Assistant</NavLink></li>
        <li><NavLink to="/history">History</NavLink></li>
      </ul>
    </nav>
  );
};