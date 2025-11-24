import React, { useState } from 'react';
import { Header } from '../../components/Header/Header';
import { Widget } from '../../components/Widget/Widget';
import { useTheme } from '../../context/ThemeContext';
import { 
  Wifi, 
  Bot, 
  Database, 
  Monitor, 
  Trash2, 
  Download, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import './SettingsPage.css';

export const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  
  // --- Local State for Settings ---
  const [scanInterval, setScanInterval] = useState('6h');
  const [signalThreshold, setSignalThreshold] = useState(-85);
  const [aiLevel, setAiLevel] = useState<'simple' | 'expert'>('simple');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [language, setLanguage] = useState('en');

  // --- Handlers ---
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to delete all scan history? This cannot be undone.')) {
      // Тут буде виклик API до бекенду
      sessionStorage.clear();
      alert('History cleared (Session storage wiped). Backend implementation pending.');
    }
  };

  const handleExport = () => {
    alert('Exporting report... (Feature pending)');
  };

  return (
    <div className="settings-page">
      <Header title="Settings" />

      <div className="settings-grid">
        
        {/* 1. Scanner Settings */}
        <Widget className="settings-page-widget">
          <div className="settings-section-header">
            <h3>Scanner Configuration</h3>
          </div>
          
          <div className="setting-row">
            <label className="setting-label">Auto-Scan Interval</label>
            <select 
              className="settings-select"
              value={scanInterval}
              onChange={(e) => setScanInterval(e.target.value)}
            >
              <option value="off">Off (Manual only)</option>
              <option value="1h">Every hour</option>
              <option value="6h">Every 6 hours</option>
              <option value="24h">Once a day</option>
            </select>
            <p className="setting-desc">Frequency of background Wi-Fi analysis.</p>
          </div>

          <div className="setting-row">
            <label className="setting-label">Signal Threshold</label>
            <div className="range-container">
              <input 
                type="range" 
                min="-100" 
                max="-60" 
                step="1"
                className="settings-range"
                value={signalThreshold}
                onChange={(e) => setSignalThreshold(Number(e.target.value))}
              />
              <span className="range-value">{signalThreshold} dBm</span>
            </div>
            <p className="setting-desc">Ignore networks weaker than this value.</p>
          </div>
        </Widget>
        {/* 2. AI Assistant */}
        <Widget className="settings-page-widget">
          <div className="settings-section-header">
            <h3>AI Assistant</h3>
          </div>

          <div className="setting-row">
            <label className="setting-label">Expertise Level</label>
            <div className="toggle-group">
              <button 
                className={`toggle-option ${aiLevel === 'simple' ? 'active' : ''}`}
                onClick={() => setAiLevel('simple')}
              >
                Simple
              </button>
              <button 
                className={`toggle-option ${aiLevel === 'expert' ? 'active' : ''}`}
                onClick={() => setAiLevel('expert')}
              >
                Expert
              </button>
            </div>
            <p className="setting-desc">
              {aiLevel === 'simple' 
                ? 'Basic advice and pre-defined actions.' 
                : 'Technical details, raw data analysis, and advanced prompts.'}
            </p>
          </div>

          <div className="setting-row">
            <label className="setting-label">OpenAI / Gemini API Key</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showKey ? "text" : "password"} 
                className="settings-input"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button 
                onClick={() => setShowKey(!showKey)}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#888'
                }}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="setting-desc">Your key is stored locally.</p>
          </div>
        </Widget>

        {/* 3. Data & Storage */}
        <Widget className="settings-page-widget">
          <div className="settings-section-header">
            <h3>Data & Storage</h3>
          </div>

          <div className="setting-row">
            <label className="setting-label">Export Report</label>
            <button className="btn-action export" onClick={handleExport}>
              <Download size={18} /> Download JSON Report
            </button>
          </div>

          <div className="setting-row">
            <label className="setting-label" style={{ color: '#dc2626' }}>Danger Zone</label>
            <button className="btn-action danger" onClick={handleClearHistory}>
              <Trash2 size={18} /> Clear All History
            </button>
            <p className="setting-desc">Permanently deletes history from local storage and backend.</p>
          </div>
        </Widget>

        {/* 4. Appearance */}
        <Widget className="settings-page-widget">
          <div className="settings-section-header">
            <h3>Interface</h3>
          </div>

          <div className="setting-row">
            <label className="setting-label">Theme</label>
            <div className="toggle-group">
              <button 
                className={`toggle-option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => theme === 'dark' && toggleTheme()}
              >
                Light
              </button>
              <button 
                className={`toggle-option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => theme === 'light' && toggleTheme()}
              >
                Dark
              </button>
            </div>
          </div>

          <div className="setting-row">
            <label className="setting-label">Language</label>
            <select 
              className="settings-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English (United States)</option>
              <option value="ua">Українська (Ukrainian)</option>
            </select>
          </div>
        </Widget>

      </div>
    </div>
  );
};