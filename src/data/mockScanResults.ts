// тип для однієї Wi-Fi мережі
export interface WifiNetwork {
  ssid: string;       // Назва мережі
  bssid: string;      // MAC-адреса точки доступу
  channel: number;    // Канал (1-13 для 2.4GHz, 36+ для 5GHz)
  rssi: number;       // Сила сигналу (від -100 до -30)
  security: string; // Тип безпеки (WPA2, WPA3, etc.)
  band: '2.4 GHz' | '5 GHz'; // Діапазон
}

// Приклад даних сканування
export const mockScanResults: WifiNetwork[] = [
  {
    ssid: 'MyHome_WiFi',
    bssid: 'AA:BB:CC:11:22:33',
    channel: 6,
    rssi: -45,
    security: 'WPA2',
    band: '2.4 GHz',
  },
  {
    ssid: 'Neighbor_Net_1',
    bssid: 'DD:EE:FF:44:55:66',
    channel: 6,
    rssi: -68,
    security: 'WPA2',
    band: '2.4 GHz',
  },
  {
    ssid: 'Kyivstar_Free',
    bssid: 'A1:B2:C3:D4:E5:F6',
    channel: 1,
    rssi: -75,
    security: 'Open',
    band: '2.4 GHz',
  },
  {
    ssid: 'Volia_Caffe',
    bssid: 'A2:B3:C4:D5:E6:F7',
    channel: 11,
    rssi: -52,
    security: 'WPA2',
    band: '2.4 GHz',
  },
  {
    ssid: 'Another_Neighbor',
    bssid: 'A3:B4:C5:D6:E7:F8',
    channel: 6,
    rssi: -81,
    security: 'WPA3',
    band: '2.4 GHz',
  },
  {
    ssid: 'MyHome_WiFi_5G',
    bssid: 'AA:BB:CC:11:22:34',
    channel: 44,
    rssi: -42,
    security: 'WPA3',
    band: '5 GHz',
  },
  {
    ssid: 'Secret_Bunker',
    bssid: 'A4:B5:C6:D7:E8:F9',
    channel: 36,
    rssi: -88,
    security: 'WPA2',
    band: '5 GHz',
  },
];