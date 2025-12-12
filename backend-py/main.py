from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware

from heatmap import generate_smooth_heatmap
from wifi_service import scan_networks
import uvicorn
import time
from speedtest_service import run_speedtest, get_history
from ai_assistant.assistant_service import get_ai_response
from history_service import load_history, save_history_entry, clear_history
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response, JSONResponse
from pydantic import BaseModel
from typing import Dict, Any
import base64
from typing import List

from apscheduler.schedulers.background import BackgroundScheduler
from contextlib import asynccontextmanager
from triggers import check_speedtest_result
from notification_service import load_notifications, clear_notifications, mark_all_read

scheduler = None
JOB_ID = 'speedtest_job'


def scheduled_speedtest():
    print("--- [SCHEDULED JOB] Auto-speedtest started... ---", flush=True)
    try:
        result = run_speedtest()
        if result:
            print(f"--- [SCHEDULED JOB] Success: {result['download']} Mbps ---", flush=True)
            
            try:
                check_speedtest_result(
                    result['download'],
                    result['upload'],
                    result['ping']
                )
            except Exception as e:
                print(f"--- [TRIGGER ERROR] Failed to check rules: {e} ---")
                    
            else:
                print("--- [SCHEDULED JOB] Failed ---", flush=True)
                
    except Exception as e:
        print(f"--- [SCHEDULED JOB] Error: {e} ---", flush=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler = BackgroundScheduler()

    scheduler.add_job(scheduled_speedtest, 'interval', hours=6, id=JOB_ID)

    scheduler.start()
    print("--- [SCHEDULER] Background scheduler started (Every 6 hours) ---", flush=True)

    yield

    scheduler.shutdown()
    print("--- [SCHEDULER] Shut down", flush=True)

app = FastAPI(lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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


@app.get("/api/speedtest/history")
def get_speedtest_history():
    return {"success": True, "data": get_history()}


def execute_speedtest_task():
    print("--- [MANUAL] Speedtest started in background... ---", flush=True)
    start_time = time.time()
    
    try:
        result = run_speedtest()  # Це займає 20-30 сек
        duration = round(time.time() - start_time, 2)
        
        if result:
            print(f"--- [MANUAL] Finished in {duration}s. Result saved. ---", flush=True)

            try:
                check_speedtest_result(
                    result['download'], 
                    result['upload'], 
                    result['ping']
                )
            except Exception as e:
                print(f"--- [TRIGGER ERROR] {e} ---")

        else:
            print("--- [MANUAL] Failed to get result ---", flush=True)
    except Exception as e:
        print(f"--- [MANUAL] Error: {e} ---", flush=True)


@app.post("/api/speedtest/run")
def trigger_speedtest(background_tasks: BackgroundTasks):
    background_tasks.add_task(execute_speedtest_task)
    
    return {"success": True, "message": "Test started in background"}


class PromptData(BaseModel):
    message: str
    level: str = "simple" 
    action_type: str | None = None
    language: str = "en"  
    device_model: str = "unknown"


@app.post("/api/assistant/send")
def send_prompt(data: PromptData):
    response = ''
    try:
        print(f'AI request data: {data}\n')
        response = get_ai_response(
            data.message,
            data.action_type,
            data.language,
            data.device_model,
            data.level
        )
        return {"success": True, "response": response}

    except Exception as e:
        print(f'--- Failed to get AI response from LLM... ---')
        print(f'--- Error: {str(e)} ---')
        return {"success": False, "error": str(e)}


class HistoryItem(BaseModel):
    type: str
    summary: str
    details: Dict[str, Any]


@app.get("/api/history")
def get_history_route():
    return {"success": True, "data": load_history()}


@app.post("/api/history")
def add_history_route(item: HistoryItem):
    try:
        entry = save_history_entry(item.type, item.summary, item.details)
        return {"success": True, "data": entry}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.delete("/api/history")
def delete_history_route():
    clear_history()
    return {"success": True, "message": "History cleared"}


@app.get("/api/notifications")
def get_notifications():
    return {"success": True, "data": load_notifications()}


@app.post("/api/notifications/read")
def read_notifications():
    mark_all_read()
    return {"success": True}


@app.delete("/api/notifications")
def delete_notifications():
    clear_notifications()
    return {"success": True}


class HeatmapPoint(BaseModel):
    """Модель однієї точки сканування."""
    x: float  
    y: float  
    rssi: int 

class HeatmapRequest(BaseModel):
    """Модель запиту від фронтенду."""
    points: List[HeatmapPoint]
    ssid: str
    width: int  
    height: int
    all_points_json: str


@app.post("/api/generate_heatmap")
def generate_heatmap_endpoint(request: HeatmapRequest):
    print('Handling heatmap generation request')
    """
    Приймає точки та повертає зображення теплової карти.
    """
    print(f'All heatmap points: {request.all_points_json}')
    with open('heatmap_points.json', 'w') as f:
        try:
            f.write(request.all_points_json)
        except Exception as e:
            print('Failed to save all heatmap points...')
            print(str(e))

    try:
        if not request.points:
            print('NO POINTS!!!')
            return JSONResponse(content={"heatmap_base64": ""})

        print('GENERATING HEATMAP IMAGE')
        # 1. Генерація PNG байтів
        png_bytes = generate_smooth_heatmap(request.points, request.width, request.height)

        print('ENCODING HEATMAP IMAGE')
        # 2. Кодування PNG в Base64 для передачі на фронтенд
        base64_encoded = base64.b64encode(png_bytes).decode('utf-8')

        # 3. префікс для Data URL
        data_url = f"data:image/png;base64,{base64_encoded}"

        return JSONResponse(content={"heatmap_base64": data_url})

    except Exception as e:
        print(f"Error during heatmap generation: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
