import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import { Play, Download, Upload, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next'; 
import { Widget } from './Widget';
import './SpeedtestWidget.css';

interface TestResult {
  timestamp: string;
  download: number;
  upload: number;
  ping: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="tooltip-date">
          {format(parseISO(label), 'MMM dd, HH:mm')}
        </p>
        <div className="tooltip-row download">
          <span>Download:</span>
          <strong>{payload[0].value} Mbps</strong>
        </div>
        <div className="tooltip-row upload">
          <span>Upload:</span>
          <strong>{payload[1].value} Mbps</strong>
        </div>
      </div>
    );
  }
  return null;
};

export const SpeedtestWidget = ({ className }: { className?: string }) => {
  const { t } = useTranslation(); 
  const [data, setData] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('week');

  const latest = data[data.length - 1] || { download: 0, upload: 0, ping: 0 };

  const fetchData = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${API_URL}/api/speedtest/history`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (e) {
      console.error(e);
    }
  };

  const runTest = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      await fetch(`${API_URL}/api/speedtest/run`, { method: 'POST' });
      await new Promise(resolve => setTimeout(resolve, 35000));
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(() => {
        fetchData();
    }, 30000)

    return () => clearInterval(intervalId);
  }, []);

  const getFilteredData = () => {
    const now = new Date();
    let cutoff = now;
    if (filter === 'day') cutoff = subDays(now, 1);
    if (filter === 'week') cutoff = subDays(now, 7);
    if (filter === 'month') cutoff = subDays(now, 30);

    return data.filter(item => parseISO(item.timestamp) >= cutoff);
  };

  return (
    <Widget className={`speedtest-widget ${className || ''}`}>
      <div className="st-header">
        <div className="st-title">
          <h3>{t('dashboard.speed')}</h3>
          <span className="live-indicator">
            <span className="dot"></span> Live
          </span>
        </div>
        
        <div className="st-filters">
          {(['day', 'week', 'month'] as const).map((f) => (
            <button 
              key={f} 
              className={filter === f ? 'active' : ''} 
              onClick={() => setFilter(f)}
            >
              {f === 'day' ? '24h' : f === 'week' ? '7d' : '30d'}
            </button>
          ))}
        </div>
      </div>

      <div className="st-content">
        <div className="st-stats">
          <div className="stat-item">
            <span className="label"><Download size={14}/> Download</span>
            <span className="value">{latest.download} <small>Mbps</small></span>
          </div>
          <div className="stat-item">
            <span className="label"><Upload size={14}/> Upload</span>
            <span className="value">{latest.upload} <small>Mbps</small></span>
          </div>
          <div className="stat-item">
            <span className="label"><Activity size={14}/> Ping</span>
            <span className="value">{latest.ping} <small>ms</small></span>
          </div>

          <button 
            className={`run-test-btn ${loading ? 'loading' : ''}`} 
            onClick={runTest} 
            disabled={loading}
          >
            {loading ? (
                t('scanner.btn_scanning') 
            ) : (
                <><Play size={16} fill="currentColor" /> {t('dashboard.speed_btn')}</> 
            )}
          </button>
        </div>

        <div className="st-chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getFilteredData()}>
              <defs>
                <linearGradient id="colorDownload" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#007bff" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#007bffa2" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#c3c3c3ff" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(str) => {
                    const date = parseISO(str);
                    if (filter === 'day') {
                        return format(parseISO(str), 'HH:mm');
                    }
                    return format(date, 'dd MMM');
                }}
                tick={{fontSize: 10}}
                stroke="#aeaeaeff"
                minTickGap={30}
              />
              <YAxis tick={{fontSize: 10}} stroke="#ccc" />
              <Tooltip content={<CustomTooltip />}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                labelFormatter={(str) => format(parseISO(str), 'PP p')}
              />
              <Area 
                type="monotone" 
                dataKey="download" 
                stroke="#007bff" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorDownload)" 
              />
              <Area 
                type="monotone" 
                dataKey="upload" 
                stroke="#82ca9d" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorUpload)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Widget>
  );
};