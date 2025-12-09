import json
import os
from datetime import datetime

HISTORY_FILE = "history_data.json"

def load_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []

def save_history_entry(entry_type, summary, details):
    history = load_history()
    
    new_entry = {
        "id": str(int(datetime.now().timestamp() * 1000)), 
        "timestamp": datetime.now().isoformat(),
        "type": entry_type, # 'scan' або 'heatmap'
        "summary": summary,
        "details": details
    }
    
    # найновіші зверху
    history.insert(0, new_entry)
    
    # останні 100 записів
    history = history[:100]
    
    with open(HISTORY_FILE, "w", encoding="utf-8") as f:
        json.dump(history, f, ensure_ascii=False, indent=2)
        
    return new_entry

def clear_history():
    if os.path.exists(HISTORY_FILE):
        os.remove(HISTORY_FILE)
    return True