import os
import json
import asyncio
import base64
import shlex
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, Security
from fastapi.security.api_key import APIKeyQuery, APIKeyHeader
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="AutoPhone Controller Backend")

# Allow CORS for Next.js development client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In production, this would be loaded from environment variables
SECRET_API_KEY = os.environ.get("APP_SECRET_KEY", "default_secret_key_change_me")

api_key_query = APIKeyQuery(name="auth", auto_error=False)
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def get_api_key(
    api_key_query: str = Security(api_key_query),
    api_key_header: str = Security(api_key_header),
):
    if api_key_query == SECRET_API_KEY:
        return api_key_query
    if api_key_header == SECRET_API_KEY:
        return api_key_header
    raise HTTPException(status_code=403, detail="Forbidden: Invalid Secret API Key")


class ActionIntent(BaseModel):
    action: str
    x: int = None
    y: int = None
    text: str = None
    duration: int = None

async def run_adb_command(cmd: list) -> str:
    """Execute ADB command using asyncio subprocess"""
    try:
        # Note: in Termux, ADB needs to be installed, connected, and authorized
        process = await asyncio.create_subprocess_exec(
            'adb', *cmd,
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        stdout, stderr = await process.communicate()
        if process.returncode != 0:
            return f"Error: {stderr.decode().strip()}"
        return stdout.decode().strip()
    except Exception as e:
        return f"Exception executing adb: {str(e)}"

@app.get("/api/health")
async def health_check():
    """Health check endpoint to measure latency and test connectivity."""
    return {"status": "ok", "service": "AutoPhone Backend Edge Node"}


@app.post("/api/action")
async def execute_action(intent: ActionIntent, api_key: str = Depends(get_api_key)):
    """REST framework to execute zero-touch action intents via ADB."""
    if intent.action == "tap":
        if intent.x is None or intent.y is None:
            raise HTTPException(status_code=400, detail="x and y missing")
        result = await run_adb_command(['shell', 'input', 'tap', str(intent.x), str(intent.y)])
        return {"status": "success", "command": f"tap {intent.x} {intent.y}", "output": result}
    
    elif intent.action == "type":
        if not intent.text:
            raise HTTPException(status_code=400, detail="text required")
        # Handle spaces for adb input text
        safe_text = str(intent.text).replace(' ', '%s')
        result = await run_adb_command(['shell', 'input', 'text', safe_text])
        return {"status": "success", "command": f"type {intent.text}", "output": result}
        
    elif intent.action == "swipe":
        duration = intent.duration or 300
        dx = intent.x or 500
        dy = intent.y or 1000
        result = await run_adb_command(['shell', 'input', 'swipe', str(dx), str(dy), str(dx), str(dy - 500), str(duration)])
        return {"status": "success", "output": result}
    
    else:
        raise HTTPException(status_code=400, detail=f"Unknown intent: {intent.action}")

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_text(json.dumps(message))

manager = ConnectionManager()

async def stream_screen():
    while True:
        try:
            if manager.active_connections:
                process = await asyncio.create_subprocess_exec(
                    'adb', 'exec-out', 'screencap', '-p',
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.PIPE
                )
                stdout, stderr = await process.communicate()
                if process.returncode == 0 and stdout:
                    b64_img = base64.b64encode(stdout).decode('utf-8')
                    await manager.broadcast({
                        "type": "screen",
                        "data": f"data:image/png;base64,{b64_img}"
                    })
        except Exception:
            pass
        # ~2 FPS max to prevent overwhelming the socket
        await asyncio.sleep(0.5)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(stream_screen())

@app.websocket("/ws/connect")
async def websocket_endpoint(websocket: WebSocket, auth: str = None):
    """Real-time bi-directional bridge for AI telemetry and commands."""
    # 1. Security & API Vault Validator check
    if auth != SECRET_API_KEY:
        await websocket.close(code=1008, reason="Forbidden Valid Secret Key Missing")
        return
        
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                msg_type = message.get("type")
                
                # 2. Connection Health & Latency Monitor
                if msg_type == "ping":
                    await websocket.send_text(json.dumps({
                        "type": "pong",
                        "timestamp": message.get("timestamp")
                    }))
                
                # 3. Action routing
                elif msg_type == "action":
                    payload = message.get("payload", {})
                    action = payload.get("action")
                    
                    # Offload to ADB runtime without blocking the event loop
                    if action == "tap":
                        asyncio.create_task(run_adb_command(['shell', 'input', 'tap', str(payload.get("x", 0)), str(payload.get("y", 0))]))
                    elif action == "shell":
                        command = payload.get("command", "")
                        if command:
                            args = shlex.split(command)
                            asyncio.create_task(run_adb_command(['shell'] + args))
                    
                    # Echo log to other clients
                    await manager.broadcast({
                        "type": "log",
                        "payload": f"Device executed: {action}"
                    })

            except json.JSONDecodeError:
                pass
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
