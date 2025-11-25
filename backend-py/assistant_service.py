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


def get_ai_response(prompt):
    if not API_KEY:
        return "Error: API Key not found. Check the .env file on the backend."
    try:            
        model = genai.GenerativeModel(MODEL)
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"--- AI Error details: {e} ---")
    return "An error occurred while accessing the AI."
