from typing import Annotated
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from git import Repo
from pydantic import BaseModel
import sys
import os

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

templates = Jinja2Templates(directory="public")

@app.get("/")
async def get_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

ws_connections  = {}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    ws_connections.append(websocket)
    print('-------------------  ws list')
    for connect in ws_connections:
        for key, value in connect.items():
            print(key, ' : ', value)
    try:
        while True:
            data = await websocket.receive_text()
            print('ws connected')
            print(data)
            await websocket.send_text(f"Message text was {data}")
    except WebSocketDisconnect:
        ws_connections.remove(websocket)
        print('ws disconnected')
        


@app.post("/api/repo")
async def request_test(request: Request):
    result = await request.json()
    url = result["url"]
    print(url)
    name = url.split("/")[3]
    target_dir = os.path.abspath(__file__) + "/" + name
    print(target_dir)
    if os.path.isdir(name) == True:
        return {"msg": "Already Exists"}
    Repo.clone_from(url, name)
    return {"msg": "good"}

@app.post("/api/check_github_id")
async def check_github_id_in_websocket(request: Request):
    result = await request.json()
    id = result["id"]
    print('id : ', id)
    if id in ws_connections:
        return False
    return True
