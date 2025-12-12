import React, { useState } from 'react';
import { useTranslation } from 'react-i18next'; 
import { generatePDFReport } from '../../utils/pdfGenerator';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import { InfoTooltip } from '../../components/InfoTooltip/InfoTooltip';
import { useSettings } from '../../context/SettingsContext';
import { 
  Bell, Moon, Globe, Database, Trash2, Download, Eye, EyeOff, ChevronRight, Volume2, Loader2, FileText 
} from 'lucide-react';
import './SettingsPage.css';

export const SettingsPage = () => {
  const { t } = useTranslation(); 
  const { theme, toggleTheme } = useTheme();
  const { settings, updateSettings } = useSettings();
  const [isGenerating, setIsGenerating] = useState(false);

  // --- Local State ---
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const getRangeBackgroundSize = (value: number, min: number, max: number) => {
    return { backgroundSize: `${((value - min) * 100) / (max - min)}% 100%` };
  };

    
  const [editWifi, setEditWifi] = useState(false);
  const [localDeviceModel, setLocalDeviceModel] = useState(settings.wifiDeviceModel || '');


  // --- Handlers ---
  const handleClearHistory = () => {
    if (window.confirm(t('settings.confirm_clear'))) { 
      sessionStorage.clear();
      alert(t('settings.history_cleared')); 
    }
  };

  const handleExport = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    try {
          await generatePDFReport();
          toast.success("Report downloaded!");
    } catch (error) {
          console.error(error);
          toast.error("Failed to generate report");
    } finally {
          setIsGenerating(false);
    }
  };
  
  const handleSaveWifi = () => {
	updateSettings({ wifiDeviceModel: localDeviceModel.trim() });
	setEditWifi(false);
	toast.success(t('settings.saved'));
  };
  
  return (
    <div className="settings-page">
	  
      {/* --- GROUP 1: WiFi Device Model --- */}
        <div className="settings-group-title">{t('settings.wifi_device')}</div>
        <div className="settings-divider" />
      
        <div className="settings-container">
      
      {/* Row: WiFi Device Model */}
      <div className="settings-row">
        <div className="row-left">
        <div className="row-info">
          <span className="row-label">{t('settings.wifi_device_model') || 'Wi-Fi Device Model'}</span>
          <InfoTooltip text={t('settings.tooltip_model')} />
        </div>
        </div>

        <div className="row-right" style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '70px' }}>
          <input 
          type="text"
          className="glass-input"
          value={localDeviceModel}
          readOnly={!editWifi} 
          onChange={(e) => setLocalDeviceModel(e.target.value)}
          style={{
            flex: 1,
            background: editWifi ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)",
            color: "#000",
            border: "1px solid rgba(0,0,0,0.3)",
            padding: "6px 10px",
            borderRadius: "8px",
            opacity: editWifi ? 1 : 0.6,
            pointerEvents: editWifi ? "auto" : "none",
          }}
          />

          <label className="toggle-switch">
          <input 
            type="checkbox"
            checked={editWifi}
            onChange={() => {
            if (editWifi) handleSaveWifi();
            setEditWifi(!editWifi);
            }}
          />
          <span className="slider"></span>
          </label>
        </div>

      </div>
        
        {/* --- GROUP 2: SCANNER --- */}
        <div className="settings-group-title">{t('settings.scanner')}</div>
        <div className="settings-divider" />

        <div className="settings-group glass-panel">
          
          {/* Row: Auto-Scan */}
          <div className="settings-row">
            <div className="row-left">
              <div className="row-info">
                <span className="row-label">{t('settings.speedtest')}</span>
                <InfoTooltip text={t('settings.tooltip_speedtest')} />
              </div>
            </div>
            <div className="row-right">
              <select 
                className="glass-select"
                value={settings.scanInterval} 
                onChange={(e) => updateSettings({ scanInterval: e.target.value })}
              >
                <option value="off">{t('settings.off')}</option>
                <option value="1h">{t('settings.1h')}</option>
                <option value="6h">{t('settings.6h')}</option>
                <option value="24h">{t('settings.daily')}</option>
              </select>
            </div>
          </div>

          {/* Row: Threshold */}
          <div className="settings-row align-start">
             <div className="row-left">
              <div className="row-info">
                <span className="row-label">{t('settings.threshold')}</span>
                <InfoTooltip text={t('settings.tooltip_threshold')} />
              </div>
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
              <span className="row-desc">{t('settings.ignore')} {settings.signalThreshold} dBm</span>
            </div>
          </div>
        </div>

        {/* --- GROUP 3: AI ASSISTANT --- */}
        <div className="settings-group-title">{t('settings.intelligence')}</div>
        <div className="settings-divider" />

        <div className="settings-group glass-panel">
          <div className="settings-row">
            <div className="row-left">
              <div className="row-info">
                <span className="row-label">{t('settings.ai')}</span>
                <InfoTooltip text={t('settings.tooltip_ai')} />
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
          
          {/* API Key */}
          <div className="settings-row">
            <div className="row-left">
              <div className="row-info"><span className="row-label">API Key</span></div>
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

        {/* --- GROUP 4: NOTIFICATIONS --- */}
        <div className="settings-group-title">{t('settings.notifications')}</div>
        <div className="settings-divider" />

        <div className="settings-group glass-panel">
          
          <div className="settings-row">
            <div className="row-left">
              <div className="icon-box" style={{ color: '#ef4444' }}>
                <Bell size={20} />
              </div>
              <div className="row-info">
                <span className="row-label">{t('settings.alerts')}</span>
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
              <div className="icon-box" style={{ color: '#ef4444' }}>
                <Volume2 size={20} />
              </div>
              <div className="row-info">
                <span className="row-label">{t('settings.sound')}</span>
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

        {/* --- GROUP 5: INTERFACE --- */}
        <div className="settings-group-title">{t('settings.appearance')}</div>
        <div className="settings-divider" />

        <div className="settings-group glass-panel">
          
          <div className="settings-row">
            <div className="row-left">
              <div className="icon-box" style={{ color: '#eab308' }}>
                <Moon size={20} />
              </div>
              <div className="row-info">
                <span className="row-label">{t('settings.dark_mode')}</span>
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
                <span className="row-label">{t('settings.language')}</span>
              </div>
            </div>
            <div className="row-right">
               <select 
                className="glass-select"
                value={settings.language} 
                onChange={(e) => updateSettings({ language: e.target.value })}
              >
                <option value="en">English</option>
                <option value="ua">Українська</option>
              </select>
            </div>
          </div>
        </div>

      {/* DATA */}
        <div className="settings-group-title">{t('settings.data')}</div>
        <div className="settings-divider" />

        <div className="settings-group glass-panel">
          
          <div 
            className="settings-row clickable" 
            onClick={handleExport}
            style={{ 
              cursor: isGenerating ? 'wait' : 'pointer', 
              opacity: isGenerating ? 0.7 : 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div className="row-left">
              <div className="icon-box" style={{ color: '#3b82f6' }}>
                <FileText size={20} />
              </div>
              <div className="row-info">
                <span className="row-label" style={{ color: 'var(--color-accent)' }}>
                  {t('settings.export')}
                </span>
                {isGenerating && (
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>
                    Generating PDF...
                  </span>
                )}
              </div>
            </div>

          {isGenerating && (
            <div className="row-right" style={{ paddingRight: '10px' }}>
               <Loader2 size={20} className="spin" style={{ color: '#3b82f6' }} />
            </div>
          )}
        </div>

        <div className="settings-row clickable" onClick={handleClearHistory}>
             <div className="row-left">
              <div className="icon-box" style={{ color: '#ef4444' }}>
                <Trash2 size={20} />
              </div>
              <div className="row-info">
                <span className="row-label" style={{ color: '#ef4444' }}>{t('settings.clear')}</span>
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
  );
};