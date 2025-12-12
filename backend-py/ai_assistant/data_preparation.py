import json

from speedtest_service import load_history
from wifi_service import scan_networks


# get stored scan data
def get_scan_json():
    # TODO: Replace with precomputed results (maybe save scan results into JSON and replace it
    #  with each scan)
    networks = scan_networks()
    return json.dumps(networks)


def get_heatmap_json():
    with open('heatmap_points.json', 'r') as f:
        try:
            return f.read()
        except Exception as e:
            print('Failed to load all heatmap points...')
            print(str(e))
    return ''


# get stored spectrum analyzer results
def get_spectrum_json():
    # TODO: Add Spectrum Analyzer tab, save analysis results into JSON and load it here
    return ''


def get_speedtest_json():
    speedtest_history = load_history()
    return json.dumps(speedtest_history)

data_mapping = {
    'scan': (get_scan_json, 'Scanned networks'),
    'heatmap': (get_heatmap_json, 'Heatmap points'),
    'spectrum': (get_spectrum_json, 'Spectrum analyzed data'),
    'speedtest': (get_speedtest_json, 'Speedtest history'),
    # 'device_info': (get_device_info_json, 'Device info'),
    'get_conflicting_networks_hm': ('conflicting_heatmap', 'Conflicting networks AI response'),
    'get_overloaded_networks_hm': ('overloaded_heatmap', 'Overloaded networks AI response'),
}
