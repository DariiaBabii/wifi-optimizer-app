import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 

import "./index.css";
import './i18n';

import { MainLayout } from './components/MainLayout';

import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { DiagnosticsPage } from './pages/Diagnostics/DiagnosticsPage';
import { ScanPage } from './pages/ScanPage/ScanPage';
import { HeatmapPage } from './pages/HeatmapPage/HeatmapPage';
import { AssistantPage } from './pages/AssistantPage/AssistantPage';
import { HistoryPage } from './components/HistoryPage/HistoryPage';
import { NotificationsPage } from './pages/Notifications/NotificationsPage';
import { SettingsPage } from './pages/Settings/SettingsPage';

import { WifiProvider } from './context/WifiContext';
import { ThemeProvider } from './context/ThemeContext';
import { SettingsProvider } from './context/SettingsContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'diagnostics',
        element: <DiagnosticsPage />,
        children: [
          {
            path: 'scan',
            element: <ScanPage />,
          },
          {
            path: 'heatmap',
            element: <HeatmapPage />,
          },
          {
            path: '',
            element: <Navigate to="scan" replace />,
          },
        ],
      },
      {
        path: 'assistant',
        element: <AssistantPage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
      {
        path: 'notifications',
        element: <NotificationsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <SettingsProvider>
        <WifiProvider>
          <RouterProvider router={router} />
          
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '14px',
              },
              success: {
                style: {
                  background: '#ecfdf5',
                  color: '#065f46',
                  border: '1px solid #10b981'
                },
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                style: {
                  background: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #ef4444'
                },
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </WifiProvider>
      </SettingsProvider>
    </ThemeProvider>
  </React.StrictMode>
);