import json

from speedtest_service import load_history
from wifi_service import scan_networks


# get stored scan data
def get_scan_json():
    # TODO: Replace with precomputed results (maybe save scan results into JSON and replace it
    #  with each scan)
    networks = scan_networks()
    return json.dumps(networks)


# get stored heatmap data
def get_heatmap_json():
    # TODO: Save heatmap points into JSON and load it here
    return ''


# get stored spectrum analyzer results
def get_spectrum_json():
    # TODO: Add Spectrum Analyzer tab, save analysis results into JSON and load it here
    return ''


# get stored speedtests
def get_speedtest_json():
    speedtest_history = load_history()
    return json.dumps(speedtest_history)


# # get stored device info
# def get_device_info_json():
#     # TODO: Add device name to the settings tab, save result to JSON and load it here
#     return ''


# mapping data type to function or AI action_type
data_mapping = {
    'scan': (get_scan_json, 'Scanned networks'),
    'heatmap': (get_heatmap_json, 'Heatmap points'),
    'spectrum': (get_spectrum_json, 'Spectrum analyzed data'),
    'speedtest': (get_speedtest_json, 'Speedtest history'),
    # 'device_info': (get_device_info_json, 'Device info'),
    'get_conflicting_networks_hm': ('conflicting_heatmap', 'Conflicting networks AI response'),
    'get_overloaded_networks_hm': ('overloaded_heatmap', 'Overloaded networks AI response'),
}
