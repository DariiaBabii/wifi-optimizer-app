import pywifi
import time
import platform

def get_wifi_details(freq_mhz: int):
    """Calculates channel and range"""
    try:
        freq = int(freq_mhz)
    except (ValueError, TypeError):
        return 0, "Unknown"

    if 2412 <= freq <= 2484:
        channel = (freq - 2407) // 5 if freq != 2484 else 14
        return channel, "2.4 GHz"
    elif 5180 <= freq <= 5825:
        channel = (freq - 5000) // 5
        return channel, "5 GHz"
    elif 5925 <= freq <= 7125:
        channel = (freq - 5930) // 5
        return channel, "6 GHz"
    else:
        return 0, f"{freq} MHz"

def fix_encoding(ssid):
    if not ssid:
        return ""
    
    if isinstance(ssid, bytes):
        try:
            return ssid.decode('utf-8')
        except UnicodeDecodeError:
            try:
                return ssid.decode('cp1251')
            except:
                return str(ssid)

    if "\\x" in repr(ssid):
        try:
            return ssid.encode('raw_unicode_escape').decode('utf-8')
        except Exception:
            pass
            
    return ssid

def scan_networks():
    wifi = pywifi.PyWiFi()
    
    try:
        iface = wifi.interfaces()[0]
    except Exception as e:
        print(f"Error getting interface: {e}")
        return [] 

    iface.scan()
    print("Scanning... (waiting 3 seconds)")
    time.sleep(3) 

    scan_results = iface.scan_results()
    networks_list = []
    
    seen_bssids = set()

    for profile in scan_results:
        if profile.bssid in seen_bssids:
            continue
        seen_bssids.add(profile.bssid)

        security_types = []
        for akm in profile.akm:
            if akm == pywifi.const.AKM_TYPE_WPA2PSK: security_types.append("WPA2")
            elif akm == pywifi.const.AKM_TYPE_WPAPSK: security_types.append("WPA")
            elif akm == pywifi.const.AKM_TYPE_NONE: security_types.append("Open")
        
        freq_hz = profile.freq
        channel, band = get_wifi_details(freq_hz)
        
        clean_ssid = fix_encoding(profile.ssid)
        
        networks_list.append({
            "ssid": clean_ssid,
            "bssid": profile.bssid,
            "rssi": profile.signal,
            "channel": channel,
            "band": band,
            "security": " / ".join(security_types) or "Open"
        })

    # Сортуємо за силою сигналу (найсильніші зверху)
    return sorted(networks_list, key=lambda x: x['rssi'], reverse=True)