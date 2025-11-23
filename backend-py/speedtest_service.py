import speedtest
import json
import os
from datetime import datetime

HISTORY_FILE = "speedtest_history.json"

def load_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_result(result):
    history = load_history()
    history.append(result)
    history = history[-100:] 
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f)

def run_speedtest():
    try:
        st = speedtest.Speedtest()
        st.get_best_server()
        
        # швидкість (повертає біти/с, ділимо на 10^6 для Мбіт/с)
        download_speed = round(st.download() / 1_000_000, 2)
        upload_speed = round(st.upload() / 1_000_000, 2)
        ping = round(st.results.ping, 1)
        
        result = {
            "timestamp": datetime.now().isoformat(),
            "download": download_speed,
            "upload": upload_speed,
            "ping": ping,
            "server": st.results.server['sponsor']
        }
        
        save_result(result)
        return result
    except Exception as e:
        print(f"Speedtest error: {e}")
        return None

def get_history():
    return load_history()