import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface WifiNetwork {
  ssid: string;
  bssid: string;
  rssi: number;
  channel: number;
  band: '2.4 GHz' | '5 GHz' | '6 GHz';
  security: string;
  quality: number;      
  distance: number;     
  vendor: string;
}

interface WifiContextType {
  networks: WifiNetwork[];
  loading: boolean;
  error: string | null;
  scanNetworks: () => Promise<void>;
  lastUpdated: string | null;
}

const WifiContext = createContext<WifiContextType | undefined>(undefined);
const STORAGE_KEY = 'wifiScanResults';
const STORAGE_KEY_DATE = 'wifiLastUpdated';

export const WifiProvider = ({ children }: { children: ReactNode }) => {
  const [networks, setNetworks] = useState<WifiNetwork[]>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [lastUpdated, setLastUpdated] = useState<string | null>(() => {
    return sessionStorage.getItem(STORAGE_KEY_DATE);
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(networks));
  }, [networks]);

  useEffect(() => {
    if (lastUpdated) {
      sessionStorage.setItem(STORAGE_KEY_DATE, lastUpdated);
    }
  }, [lastUpdated]);

  const scanNetworks = async () => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/scan`);
      
      if (!response.ok) throw new Error('Server connection error');
      
      const result = await response.json();
      
      if (result.success) {
        const adapted = result.data.map((raw: any) => ({
        ...raw,
        band: raw.band as '2.4 GHz' | '5 GHz' | '6 GHz'        
      }));
        
        setNetworks(adapted);
        setLastUpdated(new Date().toISOString());
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WifiContext.Provider value={{ networks, loading, error, scanNetworks, lastUpdated }}>
      {children}
    </WifiContext.Provider>
  );
};

export const useWifi = () => {
  const context = useContext(WifiContext);
  if (!context) throw new Error('useWifi must be used within a WifiProvider');
  return context;
};