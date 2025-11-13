import React, { useState } from 'react';
// Імпортуємо мок-дані та тип
//import { mockScanResults, WifiNetwork } from '../../data/mockScanResults';
import './ScanPage.css'; 

export const ScanPage = () => {
  // 'useState' для зберігання даних, щоб у майбутньому їх можна було оновити
  //const [networks, setNetworks] = useState<WifiNetwork[]>(mockScanResults);

  return (
    <div className="scan-page-container">
      <button className="scan-button">Почати сканування</button>
      
      {/* поки що просто список */}
      {/* <div className="network-list">
        <h3>List of found networks ({networks.length})</h3>
        {networks.map((network) => (
          <div key={network.bssid} className="network-item">
            <strong>{network.ssid}</strong> (RSSI: {network.rssi} dBm)
            <p>Channel: {network.channel} ({network.band})</p>
          </div>
        ))}
      </div> */}
    </div>
  );
};