import React, { useState } from 'react';
import { Header } from '../../components/Header/Header';
import { useTheme } from '../../context/ThemeContext';
import { InfoTooltip } from '../../components/InfoTooltip/InfoTooltip';
import { useSettings } from '../../context/SettingsContext';
import { 
  Bell, 
  Moon, 
  Globe, 
  Trash2,
  Download,
  Eye,
  EyeOff,
  ChevronRight,
  Volume2, 
  Info
} from 'lucide-react';
import { Tooltip } from 'recharts';
import './SettingsPage.css';

export const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  
  const {settings, updateSettings} = useSettings();
  // --- Local State for Settings ---

  const [aiLevel, setAiLevel] = useState<'simple' | 'expert'>('simple');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [language, setLanguage] = useState('en');

  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const getRangeBackgroundSize = (value: number, min: number, max: number) => {
    return { backgroundSize: `${((value - min) * 100) / (max - min)}% 100%` };
  };

  // --- Handlers ---
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to delete all scan history? This cannot be undone.')) {
      // Тут буде виклик API до бекенду
      sessionStorage.clear();
      alert('History cleared.');
    }
  };

  const handleExport = () => {
    alert('Exporting report... (Feature pending)');
  };

  return (
    <div className="settings-page">

      <div className="settings-container">
        
        {/* --- GROUP 1: SCANNER --- */}
        <div className="settings-group-title">Scanner</div>
        <div className="settings-divider" />

        <div className="settings-group glass-panel">
          
          {/* Row: Auto-Scan */}
          <div className="settings-row">
            <div className="row-left">
                          
              <div className="row-info">
                <span className="row-label">Auto-Speedtest Interval</span>
              </div>
                <InfoTooltip text="Sets the time interval for automatic background speed tests to build historical performance data without user intervention." />
            </div>
            <div className="row-right">
              <select 
                className="glass-select"
                value={settings.scanInterval} 
                onChange={(e) => updateSettings({ scanInterval: e.target.value })}
              >
                <option value="off">Off</option>
                <option value="1h">Every 1h</option>
                <option value="6h">Every 6h</option>
                <option value="24h">Daily</option>
              </select>
            </div>
          </div>


          {/* Row: Threshold */}
          <div className="settings-row">

              <div className="row-left">
                <span className="row-label">Signal Threshold</span>
                <InfoTooltip text="Networks with signals weaker than this will be hidden from the scan list." />
              </div>

            <div className="row-right vertical-align">
               <input 
                type="range" 
                min="-100" max="-60" step="1"
                className="glass-range filled-range"
                value={settings.signalThreshold} 
                style={getRangeBackgroundSize(settings.signalThreshold, -100, -60)}
                onChange={(e) => updateSettings({ signalThreshold: Number(e.target.value) })} 
              />
           <span className="row-desc">Ignore below {settings.signalThreshold} dBm</span>

            </div>
          </div>

        {/* --- GROUP 2: AI ASSISTANT --- */}
        <div className="settings-group-title">Intelligence</div>
        <div className="settings-divider" />

        <div className="settings-group glass-panel">
          {/* Expertise Level */}
          <div className="settings-row">
            <div className="row-left">
              <div className="row-left">
                <span className="row-label">AI Model Level</span>
                <InfoTooltip text="Controls the depth of AI advice: simplified steps or technical analysis." />
              </div>
            </div>
            <div className="row-right">
              <div className="toggle-capsule" data-state={settings.aiLevel}>
                <div 
                  className={`capsule-option ${settings.aiLevel === 'simple' ? 'active' : ''}`}
                  onClick={() => updateSettings({ aiLevel: 'simple' })}
                >
                  Simple
                </div>
                <div 
                  className={`capsule-option ${settings.aiLevel === 'expert' ? 'active' : ''}`}
                  onClick={() => updateSettings({ aiLevel: 'expert' })}
                >
                  Expert
                </div>
                <div className="capsule-glider" />
              </div>
            </div>
          </div>
          
          <div className="settings-row">
            <div className="row-left">
              <div className="row-inаfo"><span className="row-label">API Key</span></div>
            </div>
            <div className="row-right input-wrapper">
               <input 
                type={showKey ? "text" : "password"} 
                className="glass-input"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <button className="icon-btn" onClick={() => setShowKey(!showKey)}>
                 {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* --- GROUP 3: NOTIFICATIONS (NEW) --- */}
        <div className="settings-group-title">Notifications</div>
        <div className="settings-divider" />

        <div className="settings-group glass-panel">
          
          <div className="settings-row">
            <div className="row-left">
              <div className="icon-box" style={{ color: '#3b4edfff' }}>
                <Bell size={20} />
              </div>
              <div className="row-info">
                <span className="row-label">Push Alerts</span>
              </div>
            </div>
            <div className="row-right">
               <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={pushEnabled} 
                  onChange={() => setPushEnabled(!pushEnabled)} 
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          <div className="settings-row">
            <div className="row-left">
              <div className="icon-box" style={{ color: '#3b4edfff' }}>
                <Volume2 size={20} />
              </div>
              <div className="row-info">
                <span className="row-label">Sound</span>
              </div>
            </div>
            <div className="row-right">
               <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={soundEnabled} 
                  onChange={() => setSoundEnabled(!soundEnabled)} 
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* --- GROUP 4: INTERFACE --- */}
        <div className="settings-group-title">Appearance</div>
        <div className="settings-divider" />

        <div className="settings-group glass-panel">
          
          <div className="settings-row">
            <div className="row-left">
              <div className="icon-box" style={{ color: '#eab308' }}>
                <Moon size={20} />
              </div>
              <div className="row-info">
                <span className="row-label">Dark Mode</span>
              </div>
            </div>
            <div className="row-right">
               <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={theme === 'dark'} 
                  onChange={toggleTheme} 
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

           <div className="settings-row">
            <div className="row-left">
              <div className="icon-box" style={{ color: '#10b981' }}>
                <Globe size={20} />
              </div>
              <div className="row-info">
                <span className="row-label">Language</span>
              </div>
            </div>
            <div className="row-right">
               <select 
                className="glass-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="ua">Українська</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- GROUP 5: DATA (Actions) --- */}
        <div className="settings-group-title">Data</div>
        <div className="settings-divider" />

        <div className="settings-group glass-panel">
          
          <div className="settings-row clickable" onClick={handleExport}>
             <div className="row-left">
              <div className="icon-box" style={{ color: '#3b82f6' }}>
                <Download size={20} />
              </div>
              <div className="row-info">
                <span className="row-label" style={{ color: 'var(--color-accent)' }}>Export Report</span>
              </div>
            </div>
          </div>

          <div className="settings-row clickable" onClick={handleClearHistory}>
             <div className="row-left">
              <div className="icon-box" style={{ color: '#ef4444' }}>
                <Trash2 size={20} />
              </div>
              <div className="row-info">
                <span className="row-label" style={{ color: '#ef4444' }}>Clear History</span>
              </div>
            </div>
            <div className="row-right">
              <ChevronRight size={16} className="chevron" />
            </div>
          </div>
        </div>
        
        <div className="settings-footer">
          App Version 1.0.0 (Beta)
        </div>

      </div>
    </div>
    </div>
  );
};