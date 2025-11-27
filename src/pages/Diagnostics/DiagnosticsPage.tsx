import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from '../../components/Header/Header';
import './DiagnosticsPage.css';

export const DiagnosticsPage = () => {
  const location = useLocation();

  const diagnosticTabs = [
    { label: 'Scanner', path: 'scan' },
    { label: 'Heatmap', path: 'heatmap' },
  ];

  return (
    <div className="diagnostics-container">
     <Header title="Diagnostics" tabs={diagnosticTabs} />

        <div className="tab-content" key={location.pathname}>
        <Outlet />
      </div>
    </div>
  );
};