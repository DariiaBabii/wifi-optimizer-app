from notification_service import add_notification, NotificationCategory, NotificationSeverity

def check_scan_results(networks_list):
    """
    Аналізує список мереж і створює сповіщення, якщо є проблеми.
    """
    # 1. Перевірка на відкриті мережі (Security)
    open_networks = [n for n in networks_list if "Open" in n.get('security', '')]
    if open_networks:
        names = ", ".join([n.get('ssid', 'Hidden') for n in open_networks[:3]])
        add_notification(
            NotificationCategory.SECURITY,
            "Unsecured Network Detected",
            f"Detected {len(open_networks)} open networks nearby: {names}. Keep your devices secure.",
            NotificationSeverity.WARNING
        )

    # 2. Перевірка на перевантаження каналів (Wi-Fi)
    # Спрощена логіка: якщо більше 5 мереж на одному каналі
    channels = [n.get('channel') for n in networks]
    for ch in set(channels):
        count = channels.count(ch)
        if count > 5:
            add_notification(
                NotificationCategory.WIFI,
                "Channel Congestion",
                f"Channel {ch} is very crowded ({count} networks). Consider switching.",
                NotificationSeverity.WARNING
            )

def check_speedtest_result(download, upload, ping):
    """
    Аналізує результати спідтесту.
    """
    # 1. Критично низька швидкість
    if download < 5.0:
        add_notification(
            NotificationCategory.INTERNET,
            "Low Internet Speed",
            f"Download speed dropped to {download} Mbps. Check your ISP connection.",
            NotificationSeverity.CRITICAL
        )
    
    # 2. Високий пінг
    if ping > 100:
        add_notification(
            NotificationCategory.INTERNET,
            "High Latency Detected",
            f"Ping is {ping} ms. This may affect online gaming and calls.",
            NotificationSeverity.WARNING
        )