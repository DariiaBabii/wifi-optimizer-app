import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")

if API_KEY:
    genai.configure(api_key=API_KEY)
else:
    print("Warning: GOOGLE_API_KEY not found in .env")

MODEL = 'gemini-2.5-flash-lite'


def get_ai_response(user_message, level="simple"):
    if not API_KEY:
        return "Error: API Key not found. Check the .env file on the backend."

    try:
        model = genai.GenerativeModel(MODEL)
        
        if level == "expert":
            system_instruction = (
                "You are a Network Engineer. User is an advanced user. "
                "Use technical terminology. "
                "CRITICAL: Detect the language of the user's message and RESPOND IN THE SAME LANGUAGE. "
                "If the user writes in Ukrainian, you MUST answer in Ukrainian, "
                "transliterating technical terms only if appropriate, otherwise keep terms in English but explanation in Ukrainian."
            )
        else:
            system_instruction = (
                "You are a helpful Wi-Fi Assistant for a non-technical user. "
                "Explain things in simple language. Avoid heavy jargon. "
                "Be friendly and encouraging."
            )

        full_prompt = f"{system_instruction}\n\nUser Question: {user_message}"
        response = model.generate_content(full_prompt)
        return response.text

    except Exception as e:
        print(f"--- AI Error details: {e} ---")

    return "An error occurred while accessing the AI."
