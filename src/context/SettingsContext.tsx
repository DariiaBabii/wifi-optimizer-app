import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

interface Settings {
  scanInterval: string;
  signalThreshold: number;
  aiLevel: 'simple' | 'expert';
  theme: 'light' | 'dark';
  language: string; 
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  scanInterval: 'off',
  signalThreshold: -85,
  aiLevel: 'simple',
  theme: 'light',
  language: 'en',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('app-settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
    
    if (settings.language !== i18n.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};