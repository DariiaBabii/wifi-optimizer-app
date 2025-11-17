import React, { useState, useEffect } from 'react';
import { Widget } from '../../components/Widget'; 
import './ScanPage.css'; 
import { Wifi } from 'lucide-react';

interface WifiNetworkRaw {
  ssid: string;
  bssid: string;
  rssi: number; 
  channel: number;
  frequency: number;
  security: string;
}

interface WifiNetworkClean {
  ssid: string;
  bssid: string;
  rssi: number;
  channel: number;
  band: '2.4 GHz' | '5 GHz' | '6 GHz';
  security: string;
}

const adaptNetworkData = (raw: WifiNetworkRaw): WifiNetworkClean => {
  let band: '2.4 GHz' | '5 GHz' | '6 GHz';
  
  if (raw.frequency > 5900) {
    band = '6 GHz';
  } else if (raw.frequency > 5000) {
    band = '5 GHz';
  } else {
    band = '2.4 GHz';
  }

  return {
    ssid: raw.ssid,
    bssid: raw.bssid,
    rssi: raw.rssi,
    channel: raw.channel,
    band: band,
    security: raw.security || 'Open', 
  };
};

const STORAGE_KEY = 'wifiScanResults';

export const ScanPage = () => {
  const [networks, setNetworks] = useState<WifiNetworkClean[]>(() => {
    try {
      const storedData = sessionStorage.getItem(STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error("Failed to parse stored scan data", error);
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(networks));
  }, [networks]);

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    //setNetworks([]); 
    
    try {
      const response = await fetch('http://localhost:8000/api/scan');
      
      if (!response.ok) {
        throw new Error(`Помилка HTTP! Статус: ${response.status}`);
      }
      
      const result = await response.json();

      if (result.success) {
        const adaptedData = result.data.map(adaptNetworkData);
        setNetworks(adaptedData);
      } else {
        throw new Error(result.error || 'Не вдалося відсканувати мережі.');
      }
    } catch (err: any) {
      console.error("Не вдалося отримати дані сканування", err);
      setError(err.message || 'Перевірте, чи запущено бекенд-сервер на порті 8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scan-page-container">
      <div className="scan-button-container">
        <button 
          className={`scan-button ${loading ? 'loading' : ''}`} 
          onClick={handleScan} 
          disabled={loading}
        >
          <Wifi className="scan-icon" size={20} /> 
          <span className="scan-text">
            {loading ? 'Scanning...' : 'Scan network'}
          </span>
        </button>
      </div>

      {/* Повідомлення про помилку */}
      {error && (
        <div className="scan-error">
          <strong>Помилка:</strong> {error}
        </div>
      )}

      <Widget className="scan-table-widget">
        <h3>Знайдені мережі ({networks.length})</h3>
        
        <div className="table-container">
          <table className="scan-table">
            <thead>
              <tr>
                <th>SSID</th>
                <th>Канал</th>
                <th>Діапазон</th>
                <th>RSSI (dBm)</th>
                <th>Безпека</th>
              </tr>
            </thead>
            <tbody>
              {/* Поки йде завантаження, треба показати спіннер (поки просто текст) */}
              {loading && (
                 <tr>
                    <td colSpan={5}>Завантаження даних...</td>
                  </tr>
              )}
              
              {/* Якщо завантаження завершено і є дані */}
              {!loading && networks.length > 0 && (
                networks.map((network) => (
                  <tr key={network.bssid}>
                    <td>{network.ssid || '(Прихована мережа)'}</td>
                    <td>{network.channel}</td>
                    <td>{network.band}</td>
                    <td>{network.rssi}</td>
                    <td>{network.security}</td>
                  </tr>
                ))
              )}
              
              {/* Якщо завантаження завершено і даних немає */}
              {!loading && !error && networks.length === 0 && (
                <tr>
                  <td colSpan={5}>Мережі не знайдено. Натисніть "Почати сканування".</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Widget>
    </div>
  );
};

