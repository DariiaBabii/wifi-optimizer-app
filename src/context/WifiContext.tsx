import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { calculateQuality, calculateDistance, getVendor } from '../utils/wifiCalculations'; // Імпорт

export interface WifiNetwork {
  ssid: string;
  bssid: string;
  rssi: number;
  channel: number;
  band: '2.4 GHz' | '5 GHz' | '6 GHz';
  security: string;
  quality: number;      
  distance: string;     
  vendor?: string;
}

interface WifiContextType {
  networks: WifiNetwork[];
  loading: boolean;
  error: string | null;
  scanNetworks: () => Promise<void>;
  lastUpdated: Date | null;
}

const WifiContext = createContext<WifiContextType | undefined>(undefined);

// Ключ для sessionStorage
const STORAGE_KEY = 'wifiScanResults';

export const WifiProvider = ({ children }: { children: ReactNode }) => {
  const [networks, setNetworks] = useState<WifiNetwork[]>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 2. Зберігаємо в sessionStorage при змінах
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(networks));
  }, [networks]);

  // 3. Головна функція сканування
  const scanNetworks = async () => {
    setLoading(true);
    setError(null);
    try {
      // використовуємо змінну оточення для URL
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_URL}/api/scan`);
      
      if (!response.ok) throw new Error('Помилка з\'єднання з сервером');
      
      const result = await response.json();
      
      if (result.success) {
        // Адаптація даних (якщо треба)
        const adapted = result.data.map((raw: any) => {
        let band: '2.4 GHz' | '5 GHz' | '6 GHz';
        if (raw.frequency > 5900) band = '6 GHz';
        else if (raw.frequency > 5000) band = '5 GHz';
        else band = '2.4 GHz';
     
        return {
        ssid: raw.ssid,
        bssid: raw.bssid,
        rssi: raw.rssi,
        channel: raw.channel,
        band: band,
        security: raw.security || 'Open',
        
        quality: calculateQuality(raw.rssi),
        distance: calculateDistance(raw.rssi, raw.frequency),
        vendor: getVendor(raw.bssid)
        };
        });
        
        setNetworks(adapted);
        setLastUpdated(new Date());
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

// Хук для зручного використання
export const useWifi = () => {
  const context = useContext(WifiContext);
  if (!context) throw new Error('useWifi must be used within a WifiProvider');
  return context;
};