import pywifi
import time

def convert_frequency_to_channel(freq_mhz: int) -> int:
    """
    Обчислює номер Wi-Fi каналу на основі його частоти в МГц.
    """
    try:
        freq = int(freq_mhz)
        
        # Діапазон 2.4 ГГц
        if 2412 <= freq <= 2472:
            # Канали 1-13
            return (freq - 2407) // 5
        elif freq == 2484:
            # Канал 14
            return 14
        
        # Діапазон 5 ГГц (спрощена формула)
        elif 5180 <= freq <= 5825:
            return (freq - 5000) // 5
        
        # Діапазон 6 ГГц (спрощена формула)
        elif 5945 <= freq <= 7105:
            return (freq - 5930) // 5
        
        else:
            return 0 # Невідомий канал
    except Exception:
        return 0 # Помилка конвертації

def scan_networks():
    wifi = pywifi.PyWiFi()

    # може знадобитися адмінський доступ
    try:
        iface = wifi.interfaces()[0]
    except Exception as e:
        print(f"Error getting interface: {e}")
        raise Exception("Could not find Wi-Fi interface. Run as Administrator?")

    iface.scan()
    
    print("Scanning... (waiting 3 seconds)") # зробити сканинг в бекграунді
    time.sleep(3) 

    scan_results = iface.scan_results()

    networks_list = []
    ssids = set()
    for profile in scan_results:
        security_types = []
        for akm in profile.akm:
            if akm == pywifi.const.AKM_TYPE_WPA2PSK:
                security_types.append("WPA2")
            elif akm == pywifi.const.AKM_TYPE_WPAPSK:
                security_types.append("WPA")
            elif akm == pywifi.const.AKM_TYPE_WPA3PSK: # Може знадобитися новіша версія
                security_types.append("WPA3")
            elif akm == pywifi.const.AKM_TYPE_NONE:
                security_types.append("Open")
        
        freq_hz = profile.freq

        channel = convert_frequency_to_channel(freq_hz)


        if profile.ssid not in ssids:
            networks_list.append({
                "ssid": profile.ssid,
                "bssid": profile.bssid,
                "rssi": profile.signal,  # pywifi називає це signal
                "channel": channel,
                "frequency": profile.freq,
                "security": " / ".join(security_types)
            })
    
        ssids.add(profile.ssid)
    return networks_list