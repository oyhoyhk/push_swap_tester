from typing import Annotated
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import git
from pydantic import BaseModel
import sys
import os
import asyncio

app = FastAPI()


@app.on_event("startup")
async def create_repo_directory():
    repo_dir = "repo"

    if not os.path.exists(repo_dir):
        try:
            os.makedirs(repo_dir)
            print(f"Created '{repo_dir}' directory.")
        except Exception as e:
            print(f"Error creating '{repo_dir}' directory")


origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="public")


@app.get("/")
async def get_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


ws_connections = {}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    ws_connections.append(websocket)
    print("-------------------  ws list")
    for connect in ws_connections:
        for key, value in connect.items():
            print(key, " : ", value)
    try:
        while True:
            data = await websocket.receive_text()
            print("ws connected")
            print(data)
            await websocket.send_text(f"Message text was {data}")
    except WebSocketDisconnect:
        ws_connections.remove(websocket)
        print("ws disconnected")


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

    repo_dir = "repo"

    directory_path = os.path.join(repo_dir, id)

    if os.path.exists(directory_path) and os.path.isdir(directory_path):
        return False
    else:
        return True


@app.post("/api/repository")
async def clone_git_repository(request: Request):
    result = await request.json()
    id = result["id"]
    github_repo = result["repository"]

    print(github_repo, id)
    target_directory = os.path.join("repo", id)

    try:
        git.Repo.clone_from(github_repo, target_directory)
        print("git clone success")
        return True
    except git.GitCommandError as e:
        print(f"Git Command error : {e}")
        return False
    except git.InvalidGitRepositoryError as e:
        print(f"Invalid Git repository : {e}")
        return False
    except Exception as e:
        print(f"An error occurred : {e}")
        return False


@app.get("/api/compile_test")
async def compile_test(id: str):
    print("id : ", id)
    await asyncio.sleep(1)
    return True


@app.get("/api/exception_handling_test")
async def exception_handling_test(id: str):
    print("exception_handling_test, id : ", id)
    await asyncio.sleep(1)
    return True


@app.get("/api/push_swap_test/")
async def push_swap_test(id: str, param_count: int):
    print(f"push_swap test, id : {id} param_count : {param_count}")
    await asyncio.sleep(1)
    return True
