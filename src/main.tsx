import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';

import "./index.css";

import { MainLayout } from './components/MainLayout';

import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { DiagnosticsPage } from './pages/DiagnosticsPage';
import { ScanPage } from './pages/ScanPage/ScanPage';
import { HeatmapPage } from './pages/HeatmapPage';
import { AssistantPage } from './pages/AssistantPage';
import { HistoryPage } from './pages/HistoryPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // 1. Dashboard
      {
        index: true, // "index: true" -> сторінка за замовчуванням для "/"
        element: <DashboardPage />,
      },
      // 2. Diagnostics (з вкладками)
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
            // За замовчуванням перенаправляємо на 'scan'
            path: '',
            element: <Navigate to="scan" replace />,
          },
        ],
      },
      // 3. Assistant
      {
        path: 'assistant',
        element: <AssistantPage />,
      },
      // 4. History
      {
        path: 'history',
        element: <HistoryPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);