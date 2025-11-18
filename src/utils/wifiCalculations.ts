/**
* Converts RSSI (dBm) to quality percentage (0-100%)
*/
export const calculateQuality = (rssi: number): number => {
  if (rssi <= -100) return 0;
  if (rssi >= -50) return 100;
  return 2 * (rssi + 100);
};


/** approximate distance based on RSSI and frequency
*   FSPL (Free Space Path Loss) formula
*/ 
export const calculateDistance = (rssi: number, freqInMHz: number): string => {
  const exp = (27.55 - (20 * Math.log10(freqInMHz)) + Math.abs(rssi)) / 20;
  const meters = Math.pow(10, exp);
  return meters.toFixed(1) + ' m';
};

/**
* Determines manufacturer by BSSID (MAC address)
* simplified base. need to use API or big JSON.
*/
export const getVendor = (bssid: string): string => {
  const prefix = bssid.replace(/:/g, '').substring(0, 6).toUpperCase();
  
  const vendors: Record<string, string> = {
    'F8D111': 'TP-Link', 'E848B8': 'TP-Link', '18A6F7': 'TP-Link',
    '00259C': 'Cisco',   '64D989': 'Cisco',
    '04D9F5': 'Asus',    '2C4D54': 'Asus',
    'D850E6': 'Asus',    'F07959': 'Apple',
    'BC926B': 'Apple',   '88A4C2': 'Apple',
    'C83A35': 'Tenda',   '502B73': 'Tenda',
    'E01D3B': 'Xiaomi',  '640980': 'Xiaomi',
    'D46E0E': 'D-Link',  '14D64D': 'D-Link',
    '00155D': 'Microsoft',
    '001A11': 'Google',
  };

  return vendors[prefix] || 'Unknown';
};