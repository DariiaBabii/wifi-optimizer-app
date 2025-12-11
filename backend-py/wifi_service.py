import pywifi
import time
import platform
import math
from manuf import manuf

from triggers import check_scan_results

try:
    p = manuf.MacParser(update=False)
except Exception as e:
    print(f"Warning: Manuf DB load failed: {e}")
    p = None

def get_vendor(bssid):
    if not p: return "Unknown"
    try:
        return p.get_manuf(bssid) or "Unknown"
    except:
        return "Unknown"

def calculate_distance(rssi, freq_mhz):
    """FSPL формула для відстані"""
    try:
        r = float(rssi)
        f = float(freq_mhz)
        exp = (27.55 - (20 * math.log10(f)) + abs(r)) / 20.0
        return round(pow(10.0, exp), 2)
    except Exception:
        return 0.0

def calculate_quality(rssi):
    """Converting RSSI to percentage"""
    try:
        val = int(rssi)
        if val <= -100: return 0
        if val >= -50: return 100
        return 2 * (val + 100)
    except:
        return 0

def fix_encoding(ssid):
    """Fix encoding for Cyrillic (Windows fix)"""
    if not ssid: return ""
    
    if isinstance(ssid, bytes):
        try: return ssid.decode('utf-8')
        except: 
            try: return ssid.decode('cp1251')
            except: return str(ssid)
            
    if "\\x" in repr(ssid):
        try: return ssid.encode('raw_unicode_escape').decode('utf-8')
        except: pass

    try:
        return ssid.encode('latin1').decode('utf-8')
    except Exception:
        pass
        
    return ssid

def get_wifi_details(freq_mhz: int):
    """Calculates channel and range"""
    try: freq = int(freq_mhz)
    except: return 0, "Unknown"

    if freq > 10000:
        freq = freq // 1000

    if 2412 <= freq <= 2484:
        channel = (freq - 2407) // 5 if freq != 2484 else 14
        return channel, "2.4"
    elif 5180 <= freq <= 5825:
        channel = (freq - 5000) // 5
        return channel, "5"
    elif 5925 <= freq <= 7125:
        channel = (freq - 5930) // 5
        return channel, "6"
    else:
        return 0, f"{freq} MHz"

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
            "security": " / ".join(security_types) or "Open",
            "quality": calculate_quality(profile.signal),
            "distance": calculate_distance(profile.signal, profile.freq),
            "vendor": get_vendor(profile.bssid)
        })


    try:
        check_scan_results(networks_list)
    except Exception as e:
        print(f"Error in notification triggers: {e}")

    return sorted(networks_list, key=lambda x: x['rssi'], reverse=True)