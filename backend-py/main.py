from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from wifi_service import scan_networks
import uvicorn

app = FastAPI()

# CORS
origins = [
    "http://localhost:5173",
    "http://localhost:3000", # На всякий
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routes (Маршрути) ---

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}


@app.get("/api/scan")
def get_scan_results():
    print("Received scan request...")
    try:
        networks = scan_networks()
        return {"success": True, "data": networks}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)