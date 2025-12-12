import json

# Common instructions for all answers of the AI assistant
common_instruction = ('You are a Wi-Fi analytics AI assistant for Wi-Fi analysis application. '
                      'You restricted to answer any question that is not related to application purpose! '
                      'If any non-related question appear here then answer this piece of text: '
                      'I`m sorry!\nI`m your AI assistant for purposes of this application and I can`t answer '
                      'any other questions!\nPlease, try again with the relevant one :) ')


# Get conflicting networks i.e. within the same or neighbouring channel
# Source of data: network scanning result
get_conflicting_networks_scan = {
    'simple': {
        'system_instruction': 'Instructions: Use provided JSON data of scanned Wi-Fi networks. '
                              'Output should be understandable for the beginner without deep '
                              'technical knowledge in this field. ',
        'task': 'Task: Get list of conflicting networks with the current one in terms of channels.'
    },
    'advanced': {
        'system_instruction': 'Instructions: Use provided JSON data of scanned Wi-Fi networks. '
                              'Output should be concise and clean for advanced user with the'
                              'enough technical knowledge in this field. ',
        'task': 'Task: Get list of conflicting networks with the current one in terms of channels. '
                'Provide possible causes of conflicts and short explanation how to fix it if it`s possible. '
    },
    'data_source_type': ['scan']
}


# Get conflicting networks with zones/points where they`re conflicting
# Source of data: heatmap measuring result
get_conflicting_networks_hm = {
    'simple': {
        'system_instruction': 'Instructions: Use provided JSON data of measured heatmap points '
                              'of neighbouring networks. Output should be understandable for '
                              'the beginner without deep technical knowledge in this field. '
                              'Add extra json section to the answer with the following Output_data_scheme. '
                              'This section of the answer should be in the end of the answer and separated '
                              'by !JSON! text separator at the beginning and the end of the section. ',
        'out_data_schema': 'Output_data_scheme: ' + json.dumps(
            {
                '*point_id*': ['*network_bssid*', '*network_bssid*'],
                '*point_id*': ['*network_bssid*', '*network_bssid*']
            }
        ),
        'task': 'Task: Get list of conflicting networks with the current one in terms of '
                'channels and measuring point ids. '
                'Provide to user the list of points where the current network has conflicts in text form. '
                'Fill the extra json section with these points. Replace *point_id* with the relevant id from '
                'JSON input and *network_bssid* should be replaced with the relevant conflicting bssid from '
                'JSON input. '
    },
    'advanced': {
        'system_instruction': 'Instructions: Use provided JSON data of scanned Wi-Fi networks. '
                              'Output should be concise and clean for advanced user with the'
                              'enough technical knowledge in this field. '
                              'Add extra json section to the answer with the following Output_data_scheme. '
                              'This section of the answer should be in the end of the answer and separated '
                              'by !JSON! text separator at the beginning and the end of the section. ',
        'out_data_schema': 'Output_data_scheme: ' + json.dumps(
            {
                '*point_id*': ['*network_bssid*', '*network_bssid*'],
                '*point_id*': ['*network_bssid*', '*network_bssid*']
            }
        ),
        'task': 'Task: Get list of conflicting networks in terms of channels. Provide possible '
                'causes of conflicts and short explanation how to fix it if it`s possible. '
                'Provide to user the list of points where the current network has conflicts in text form with '
                'the relevant conflicting networks as ssid : bssid. '
                'Fill the extra json section with these points. Replace *point_id* with the relevant id from '
                'JSON input and *network_bssid* should be replaced with the relevant conflicting bssid from '
                'JSON input. '
    },
    'data_source_type': ['heatmap']
}


# Get overloaded networks due to sharing the same channel
# Source of data: network scanning result
# Overload criteria: 3 or more networks within one channel
get_overloaded_networks_scan = {
    'simple': {
        'system_instruction': 'Instructions: Use provided JSON data of scanned Wi-Fi networks. '
                              'Output should be understandable for the beginner without deep '
                              'technical knowledge in this field. ',
        'task': 'Task: Get list of overloaded channels and networks that share the same channel '
                '(3 or more networks per channel including overlapping channels).'
    },
    'advanced': {
        'system_instruction': 'Instructions: Use provided JSON data of scanned Wi-Fi networks. '
                              'Output should be concise and clean for advanced user with the '
                              'enough technical knowledge in this field. ',
        'task': 'Task: Get list of overloaded channels with networks that cause overload '
                '(3 or more networks per channel including overlapping channels). '
                'Provide possible actions to fix the issue if current network is affected '
                'by overloaded channels by using one of them or '
                'by overlapping neighbouring channels with the used one. '
    },
    'data_source_type': ['scan']
}


# Get overloaded networks with zones/points where they`re conflicting
# Source of data: heatmap measures
# Overload criteria: 3 or more networks within one channel
get_overloaded_networks_hm = {
    'simple': {
        'system_instruction': 'Instructions: Use provided JSON data of measured heatmap points '
                              'and detected networks per point. Output should be understandable '
                              'for the beginner without deep technical knowledge in this field. '
                              'Add extra json section to the answer with the following Output_data_scheme. '
                              'This section of the answer should be in the end of the answer and separated '
                              'by !JSON! text separator at the beginning and the end of the section. ',
        'out_data_schema': 'Output_data_scheme: ' + json.dumps(
            {
                '*point_id*': ['*channel*', '*channel*'],
                '*point_id*': ['*channel*', '*channel*']
            }
        ),
        'task': 'Task: Identify overloaded channels in terms of measuring points where 3 or more networks '
                'share the same channel including overlapping channels. '
                'Provide the list of measuring point ids where overload occurs. '
                'Fill the extra json section with these points. Replace *point_id* with the relevant id from '
                'JSON input and *channel* should be replaced with the relevant overloaded channel from '
                'JSON input. ',
    },
    'advanced': {
        'system_instruction': 'Instructions: Use provided JSON data of measured heatmap points '
                              'and detected networks per point. Output should be concise and clean for '
                              'advanced user with the enough technical knowledge in this field. '
                              'Add extra json section to the answer with the provided Output_data_scheme. '
                              'This section of the answer should be in the end of the answer and separated '
                              'by !JSON! text separator at the beginning and the end of the section. ',
        'task': 'Task: Identify overloaded channels (3 or more networks per one channel including '
                'overlapping channels) and provide possible actions to fix the issue if current '
                'network is affected by overloaded channels by using one of them or '
                'by overlapping neighbouring channels with the used one. '
                'Provide the list of measuring points with overload in text form. '
                'Fill the extra json section with these points. Replace *point_id* with the relevant id from '
                'JSON input and *channel* should be replaced with the relevant overloaded channel from '
                'JSON input. '
    },
    'data_source_type': ['heatmap']
}


# Get zones/points with low signal levels or conflicting networks
# Source of data: heatmap measures
# Signal level criteria: S < 90 dB
get_bad_zones_hm = {
    'simple': {
        'system_instruction': 'Instructions: Use provided JSON data of measured heatmap points. '
                              'Output should be understandable for the beginner without deep technical '
                              'knowledge in this field. ',
        'task': 'Task: Identify heatmap points where signal level is low (rssi < 90 dB) or where network '
                'conflicts occur in terms of channel. Provide list of such point ids. '
    },
    'advanced': {
        'system_instruction': 'Instructions: Use provided JSON data of measured heatmap points. '
                              'Output should be concise and clean for advanced user with enough technical '
                              'knowledge in this field. ',
        'task': 'Task: Identify heatmap points where signal level is low (rssi < 90 dB) or where network '
                'conflicts occur in terms of channel. Provide list of point ids, possible reasons and '
                'short suggestions how to improve signal quality. '
    },
    'data_source_type': ['heatmap']
}


# Get optimal Wi-Fi device placement point according to the heatmap measures
# Source of data: heatmap measures
# Acceptance criteria: other networks have low signal levels at this point
get_optimal_placement = {
    'simple': {
        'system_instruction': 'Instructions: Use provided JSON data of measured heatmap points. '
                              'Output should be understandable for the beginner without deep technical '
                              'knowledge in this field. ',
        'task': 'Task: Find the best placement point for Wi-Fi device where other networks have low '
                'signal levels. Provide the selected point id and short explanation.'
    },
    'advanced': {
        'system_instruction': 'Instructions: Use provided JSON data of measured heatmap points. '
                              'Output should be concise and clean for advanced user with the enough '
                              'technical knowledge in this field. ',
        'task': 'Task: Determine the optimal placement for Wi-Fi device considering minimal interference '
                'from other networks and best propagation. Provide explanation of criteria and short '
                'recommendations about device placement. '
    },
    'data_source_type': ['heatmap']
}


# Get network analysis report combined from conflicts, overload zonal analyses
# Source of data: conflicts, overload heatmap analysis AI outputs
get_combined_analysis_report = {
    'simple': {
        'system_instruction': 'Instructions: Use provided JSON data previously generated by conflict '
                              'and overload heatmap analyses. Output should be understandable for the '
                              'beginner without deep technical knowledge in this field. ',
        'task': 'Task: Combine conflicting network analysis and overloaded zones analysis into one short, '
                'clean report.'
    },
    'advanced': {
        'system_instruction': 'Instructions: Use provided JSON data previously generated by conflict '
                              'and overload heatmap analyses. Output should be concise and clean for '
                              'advanced user with enough technical knowledge in this field. ',
        'task': 'Task: Generate combined report from conflict and overload analyses. Provide conclusions, '
                'possible causes and short improvement suggestions. '
    },
    'data_source_type': ['get_conflicting_networks_hm', 'get_overloaded_networks_hm']
}


# Get advanced unrestricted report according to the heatmap measures and channel utilization
# Source of data: heatmap measures, quasi spectrum analysis
get_advanced_analysis_report = {
    'simple': {
        'system_instruction': 'Instructions: Use provided heatmap measurements and quasi spectrum analysis '
                              'data. Output should be understandable for the beginner without deep '
                              'technical knowledge in this field. ',
        'task': 'Task: Generate simplified extended analysis report that includes signal quality, channel '
                'usage and detected conflicts in an easy to understand form.'
    },
    'advanced': {
        'system_instruction': 'Instructions: Use provided heatmap measurements and quasi spectrum analysis '
                              'data. Output should be concise and clean for advanced user with enough '
                              'technical knowledge in this field. ',
        'task': 'Task: Generate comprehensive analysis report including signal quality, interference '
                'sources, channel utilization and possible problematic areas. Provide explanations and '
                'short improvement notes. Generally, analyze all available data as deep as it possible. '
    },
    'data_source_type': ['heatmap', 'spectrum']
}


# Get advices how to optimize network i.e. change placement, channel, bandwidth, etc
# Source of data: heatmap measures, quasi spectrum analysis, device info
get_optimization_advice = {
    'simple': {
        'system_instruction': 'Instructions: Use provided heatmap measurements, quasi spectrum analysis data '
                              'and device information. Output should be understandable for the beginner '
                              'without deep technical knowledge in this field. ',
        'task': 'Task: Provide simple recommendations how to improve Wi-Fi network such as adjusting '
                'placement, changing channel or bandwidth, etc.'
    },
    'advanced': {
        'system_instruction': 'Instructions: Use provided heatmap measurements, quasi spectrum analysis data '
                              'and device information. Output should be concise and clean for advanced '
                              'user with enough technical knowledge in this field. ',
        'task': 'Task: Provide detailed optimization suggestions including channel planning, placement, '
                'bandwidth selection and interference reduction. '
    },
    'data_source_type': ['heatmap', 'spectrum', 'device_info']
}


# Get advices how to initially set up your Wi-Fi device
# Source of data: device info
get_optimal_device_settings = {
    'simple': {
        'system_instruction': 'Instructions: Use provided device information. Output should be '
                              'understandable for the beginner without deep technical knowledge in '
                              'this field. ',
        'task': 'Task: Provide simple step by step suggestions how to set up Wi-Fi router for optimal performance. '
    },
    'advanced': {
        'system_instruction': 'Instructions: Use provided device information. Output should be concise '
                              'and clean for advanced user with enough technical knowledge in this field. ',
        'task': 'Task: Provide detailed optimal configuration for Wi-Fi device including channel, bandwidth, '
                'band settings and additional technical parameters. At the end of the answer add step by step '
                'manual how to setup device with explanation for experienced users. '
    },
    'data_source_type': ['device_info']
}


# Get answer on custom user`s message without any restrictions except topic
# Source of data: all available data
get_unrestricted_answer = {
    'simple': {
        'system_instruction': 'Instructions: Use provided input data and generate an answer '
                              'within the Wi-Fi analytics domain. Output should be understandable for the '
                              'beginner without deep technical knowledge in this field. ',
        'task': 'Task: Provide simplified Wi-Fi analysis answer based on the given data.'
    },
    'advanced': {
        'system_instruction': 'Instructions: Use provided input data and generate an answer '
                              'within the Wi-Fi analytics domain. Output should be concise and clean for '
                              'advanced user with enough technical knowledge in this field. ',
        'task': 'Task: Provide extended Wi-Fi analytics answer based on the given data.'
    },
    'data_source_type': ['heatmap', 'spectrum', 'device_info', 'speedtest']
}


get_speedtest_analysis_report = {
    'simple': {
        'system_instruction': 'Instructions: Use provided speedtest history and device info. '
                              'Output should be concise for the beginner without deep '
                              'technical knowledge in this field. ',
        'task': 'Task: Analyze speedtest history and device info to determine the probable cause '
                'of Wi-Fi slowdown.'
    },
    'advanced': {
        'system_instruction': 'Instructions: Use provided speedtest history and device info. '
                              'Output should be concise and clean for advanced user with enough '
                              'technical knowledge in this field. ',
        'task': 'Task: Analyze speedtest history and device info to determine the probable cause '
                'of Wi-Fi slowdown. Give some short advices how to improve Wi-Fi network performance. '
    },
    'data_source_type': ['device_info', 'speedtest']
}


get_channel_selection_advice = {
    'simple': {
        'system_instruction': 'Instructions: Use provided JSON data of scanned Wi-Fi networks. '
                              'Output should be understandable for the beginner without deep '
                              'technical knowledge in this field. ',
        'task': 'Task: Give an advice on switching channel to improve network speed and stability. '
    },
    'advanced': {
        'system_instruction': 'Instructions: Use provided JSON data of scanned Wi-Fi networks. '
                              'Output should be concise and clean for advanced user with the'
                              'enough technical knowledge in this field. ',
        'task': 'Task: Give an advice on switching channel to improve network speed and stability. '
                'Provide a short explanation how to change channel and tell about the reasons to select '
                'certain channels. '
    },
    'data_source_type': ['scan']
}


get_network_health_analysis = {
    'simple': {
        'system_instruction': 'Instructions: Use provided latest network scan, speedtest, heatmap measurements '
                              'and quasi spectrum analysis data. Output should be understandable for '
                              'the beginner without deep technical knowledge in this field. ',
        'task': 'Task: Generate simplified network health analysis report that includes signal quality, channel '
                'usage and detected conflicts in an easy to understand form.'
    },
    'advanced': {
        'system_instruction': 'Instructions: Use provided latest network scan, speedtest, heatmap measurements '
                              'and quasi spectrum analysis data. Output should be concise and clean for '
                              'advanced user with enough technical knowledge in this field. ',
        'task': 'Task: Generate comprehensive network health analysis report including signal quality, interference '
                'sources, channel utilization and possible problematic areas. Provide explanations and '
                'short improvement notes. Generally, analyze all available data as deep as it possible. '
    },
    'data_source_type': ['scan', 'speedtest', 'heatmap', 'spectrum']
}


actions_mapping = {
    'conflicting_scan': get_conflicting_networks_scan,
    'conflicting_heatmap': get_conflicting_networks_hm,
    'overloaded_scan': get_overloaded_networks_scan,
    'overloaded_heatmap': get_overloaded_networks_hm,
    'bad_zones': get_bad_zones_hm,
    'optimal_placement': get_optimal_placement,
    'combined_analysis': get_combined_analysis_report,
    'advanced_analysis': get_advanced_analysis_report,
    'optimization_advice': get_optimization_advice,
    'init_setup': get_optimal_device_settings,
    'unrestricted': get_unrestricted_answer,
    'analyze_slow_speed': get_speedtest_analysis_report,
    'find_best_channel': get_channel_selection_advice,
    'analyze_health': get_network_health_analysis,
}
