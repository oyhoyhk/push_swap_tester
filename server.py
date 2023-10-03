from typing import Annotated
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import git
from pydantic import BaseModel
import sys
import os
import asyncio

script_path = os.path.join(os.path.dirname(__file__), 'scripts')
sys.path.append(script_path)
repo_path = os.path.join(os.path.dirname(__file__), 'repo')
sys.path.append(repo_path)

from compile_test import test_make, test_make_re_link, test_make_re, test_make_clean, test_make_fclean

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



@app.get("/")
async def get_root(request: Request):
    return { "good" : "bad" }


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


@app.get("/api/make_test")
async def make_test(id: str):
    print("make test, id : ", id)
    return test_make(id)

@app.get("/api/make_re_link_test")
async def make_test(id: str):
    return test_make_re_link(id)

@app.get("/api/make_re_test")
async def make_re_test(id: str):
    return test_make_re(id)

@app.get("/api/make_clean_test")
async def make_clean_test(id: str):
    return test_make_clean(id)

@app.get("/api/make_fclean_test")
async def make_fclean_test(id: str):
    return test_make_fclean(id)

@app.get("/api/no_param_test")
async def no_param_test(id: str):
    print("no param test, id : ", id)
    await asyncio.sleep(1)
    return { "type" : True, "msg" : "test success"}

@app.get("/api/invalid_params_test")
async def invalid_params(id: str):
    print("invalid params test, id : ", id)
    await asyncio.sleep(1)
    return { "type" : True, "msg" : "test success"}

@app.get("/api/push_swap_test")
async def invalid_params(id: str, param_count : int):
    print("invalid params test, id : ", id, " param count : ", param_count)
    await asyncio.sleep(1)
    return { "type" : True, "msg" : "test success"}