import json
import os
from datetime import datetime
import uuid

NOTIFICATIONS_FILE = "notifications.json"

class NotificationCategory:
    INTERNET = "Internet & WAN"
    WIFI = "Wi-Fi Devices"
    SECURITY = "Security"
    SYSTEM = "System"

class NotificationSeverity:
    CRITICAL = "critical"   # Червоний
    WARNING = "warning"     # Жовтий
    INFO = "info"           # Зелений/Сірий

def load_notifications():
    if not os.path.exists(NOTIFICATIONS_FILE):
        return []
    try:
        with open(NOTIFICATIONS_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            # нові зверху
            return sorted(data, key=lambda x: x['timestamp'], reverse=True)
    except:
        return []

def add_notification(category, event, description, severity):
    """
    функція додавання сповіщення
    """
    notifications = load_notifications()
    
    new_notif = {
        "id": str(uuid.uuid4()),
        "timestamp": datetime.now().isoformat(),
        "category": category,
        "event": event,
        "description": description,
        "severity": severity,
        "read": False
    }
    
    notifications.insert(0, new_notif)
    
    notifications = notifications[:200]
    
    with open(NOTIFICATIONS_FILE, "w", encoding="utf-8") as f:
        json.dump(notifications, f, ensure_ascii=False, indent=2)
        
    return new_notif

def mark_all_read():
    notifications = load_notifications()
    for n in notifications:
        n['read'] = True
    with open(NOTIFICATIONS_FILE, "w", encoding="utf-8") as f:
        json.dump(notifications, f, ensure_ascii=False, indent=2)

def clear_notifications():
    if os.path.exists(NOTIFICATIONS_FILE):
        os.remove(NOTIFICATIONS_FILE)