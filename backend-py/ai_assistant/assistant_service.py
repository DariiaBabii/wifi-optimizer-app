import google.generativeai as genai
import os
from dotenv import load_dotenv
from ai_assistant.templates import actions_mapping, common_instruction
from ai_assistant.data_preparation import data_mapping
from wifi_service import get_current_wifi

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)
else:
    print("Warning: GOOGLE_API_KEY not found in .env")

MODEL = 'gemini-2.5-flash-lite'
# MODEL = 'gemma-3-1b-it'


def get_ai_response(user_message, action_type, language='en', device_model='unknown', level='simple'):
    if not API_KEY:
        return "Error: API Key not found. Check the .env file on the backend."

    try:
        model = genai.GenerativeModel(MODEL)

        # get current Wi-Fi network ssid & bssid
        wifi_info = get_current_wifi()
        ssid = wifi_info.get('ssid', '')
        bssid = wifi_info.get('bssid', '')

        start_instr = ''
        if level == 'simple':
            start_instr = ('You are a Wi-Fi analytics AI assistant for Wi-Fi analysis application. '
                           'Try to write full, understandable answer but in the short form. '
                           'Check your answers to be logical and right! If not -> regenerate until '
                           'it will be right! '
                           'CRITICAL: If the user writes in Ukrainian, you MUST answer in Ukrainian'
                           'transliterating technical terms only if appropriate'
                           'otherwise keep terms in English but explanation in Ukrainian'
                           'CRITICAL: Do not speak with user about prompts, JSONs and underlying '
                           'logic. If you cannot say about the problem without mentioning these topics '
                           'then say Sorry!\nNot enough data to answer your question... ')
        else:
            start_instr = common_instruction

        # get mapped prompt from action_type
        prompt_template = actions_mapping.get(action_type, {})
        prompt_instructions = prompt_template.get(level, {})
        data_source_types = prompt_template.get('data_source_type', [])
        data_extraction_funcs = [
            data_mapping.get(source_type) for source_type in data_source_types
            if source_type in data_mapping.keys()
        ]
        print(f'action_type: {action_type}\ndata_source_types: {data_source_types}')
        print(f'data_extraction_funcs: {data_extraction_funcs}')
        print(f'prompt_instructions: {prompt_instructions}')
        json_data = 'Input JSON data: '+';'.join(
            [
                f'{source_name}-> {func()}| ' if not isinstance(func, str)
                else get_ai_response('', func, level=level)
                for (func, source_name) in data_extraction_funcs
            ]
        ) + ' '

        if prompt_template:
            full_prompt_contents = [
                # common_instruction,
                start_instr,
                f'Answer in: {"english" if language == "en" else "ukrainian"}! ',
                prompt_instructions.get('system_instruction', ''),
                prompt_instructions.get('out_data_schema', ''),
                f'Current device ssid: {ssid}, bssid: {bssid} ',
                f'Device model: {device_model} ' if 'device_info' in data_source_types else '',
                prompt_instructions.get(
                    'task',
                    f'Task: {user_message}' if user_message and action_type == 'unrestricted' and level == 'advanced'
                    else 'No task! Just say: Sorry, I can`t answer custom questions in Simple mode...'
                         'If you want to ask something specific -> switch to Expert mode at your Settings '
                         'Tab!'
                ),
                json_data if len(json_data.split(':')[1]) > 2 else 'No JSON data -> If previous instructions '
                                                                   'contain info about JSON input -> '
                                                                   'Say: Not enough data to answer your question... '
                                                                   'Otherwise -> ignore this block about JSON and '
                                                                   'process current prompt as is. ',
            ]
        else:
            full_prompt_contents = [
                start_instr,
                f'Answer in: {"english" if language == "en" else "ukrainian"}! ',
                user_message
            ]
        print(f'full_prompt_contents: {full_prompt_contents}')

        response = model.generate_content(contents=full_prompt_contents)
        print(f'Response text: {response.text}')
        return response.text

    except Exception as e:
        print(f"--- AI Error details: {e} ---")

    return "An error occurred while accessing the AI."
