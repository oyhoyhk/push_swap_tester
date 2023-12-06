from scripts.push_swap_test import test_push_swap
from scripts.exception_handling_test import (
    test_no_param,
    test_invalid_params,
    test_param_duplication,
)
from scripts.compile_test import (
    test_make,
    test_make_re_link,
    test_make_re,
    test_make_clean,
    test_make_fclean,
)
from typing import Annotated
from fastapi import FastAPI, Depends, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import git
from pydantic import BaseModel
import traceback
import sys
import math
import os
import asyncio
from apscheduler.schedulers.background import BackgroundScheduler
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware import Middleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.responses import FileResponse, RedirectResponse
from datetime import datetime, timedelta
import shutil
from sqlalchemy.orm import Session
from sql_app import crud, models, schemas
from sql_app.database import SessionLocal, engine


script_path = os.path.join(os.path.dirname(__file__), "scripts")
sys.path.append(script_path)
repo_path = os.path.join(os.path.dirname(__file__), "repo")
sys.path.append(repo_path)

models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


count_dict = {}

app = FastAPI()

# app.add_middleware(
#    Middleware(TrustedHostMiddleware, allowed_hosts=["yourdomain.com"])
# )


class RedirectToHomeMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        if (
            request.url.path == "/"
            or request.url.path.startswith("/api/")
            or request.url.path.startswith("/static/")
        ):
            response = await call_next(request)
            return response
        return RedirectResponse(url="/")


# app.add_middleware(RedirectToHomeMiddleware)

scheduler = BackgroundScheduler()

app.mount(
    "/static", StaticFiles(directory="push_swap_visualizer_react/dist"), name="static"
)


def clean_up_repo(id: str):
    directory_path = os.path.join(os.getcwd(), "repo", id)
    try:
        shutil.rmtree(directory_path)
        print(f"{directory_path} 삭제 성공")
    except OSError as e:
        print(f"디렉토리 삭제 중 오류 발생: {e}")


job_dict = {}
scheduler.start()


def update_schedule(id: str, directory: str):
    print("in update_schedule", id, "directory : ", directory, job_dict)
    try:
        if id in job_dict:
            scheduler.remove_job(id)
            del job_dict[id]
        start_time = datetime.now() + timedelta(minutes=1)
        scheduler.add_job(
            clean_up_repo, "date", [directory], run_date=start_time, id=id
        )
        job_dict[id] = True
        print("job_dict : ", job_dict)
    except Exception as e:
        print("in update_schedule, e : ", e)


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
async def get_root():
    html_path = "./push_swap_visualizer_react/dist/index.html"
    return FileResponse(html_path, media_type="text/html")


# @app.get("/{path:path}", include_in_schema=False)
# async def redirect_to_root(path: str):
#     return RedirectResponse(url="/", status_code=301)


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
    result = await test_make(id)
    print("in make_test, result : ", result)
    if not result["type"]:
        directory = os.path.join(os.getcwd(), "repo", id)
        update_schedule(id, directory)
    return result


@app.get("/api/make_re_link_test")
async def make_test(id: str):
    result = await test_make_re_link(id)
    if not result["type"]:
        directory = os.path.join(os.getcwd(), "repo", id)
        update_schedule(id, directory)
    return result


@app.get("/api/make_re_test")
async def make_re_test(id: str):
    result = await test_make_re(id)
    if not result["type"]:
        directory = os.path.join(os.getcwd(), "repo", id)
        update_schedule(id, directory)
    return result


@app.get("/api/make_clean_test")
async def make_clean_test(id: str):
    result = await test_make_clean(id)
    if not result["type"]:
        directory = os.path.join(os.getcwd(), "repo", id)
        update_schedule(id, directory)
    return result


@app.get("/api/make_fclean_test")
async def make_fclean_test(id: str):
    result = await test_make_fclean(id)
    if not result["type"]:
        directory = os.path.join(os.getcwd(), "repo", id)
        update_schedule(id, directory)
    return result


@app.get("/api/no_param_test")
async def no_param_test(id: str):
    result = await test_no_param(id)
    if not result["type"]:
        directory = os.path.join(os.getcwd(), "repo", id)
        update_schedule(id, directory)
    return result


@app.get("/api/invalid_params_test")
async def invalid_params_test(id: str):
    result = await test_invalid_params(id)
    if not result["type"]:
        directory = os.path.join(os.getcwd(), "repo", id)
        update_schedule(id, directory)
    return result


@app.get("/api/duplicated_params_test")
async def duplicated_params_test(id: str):
    result = await test_param_duplication(id)
    if not result["type"]:
        directory = os.path.join(os.getcwd(), "repo", id)
        update_schedule(id, directory)
    return result


def add_record(id, country, param_count, answer_count):
    record = Record(id, country, param_count, answer_count)
    db_session.add(record)
    db_session.commit()


@app.get("/api/push_swap_test")
async def push_swap_test(
    id: str, param_count: int, country: str, db: Session = Depends(get_db)
):
    result = await test_push_swap(id, param_count)
    print(f"id : {id} country : {country}")

    if not result["type"]:
        directory = os.path.join(os.getcwd(), "repo", id)
        update_schedule(id, directory)
        return result

    if not id in count_dict:
        count_dict[id] = {}
    if not param_count in count_dict[id]:
        count_dict[id][param_count] = {
            "count": 0,
            "answers": 0,
        }
    count_dict[id][param_count]["count"] += 1
    count_dict[id][param_count]["answers"] += len(result["answers"])

    print(count_dict)

    for id, id_dict in count_dict.items():
        print("id : ", id)
        for param, param_result in id_dict.items():
            print("---- param : ", param)
            print("---- count : ", param_result["count"])
            print("---- answers : ", param_result["answers"])

    if count_dict[id][param_count]["count"] == 5:
        avg = math.ceil(count_dict[id][param_count]["answers"] / 5)
        record_data = {
            "id": id,
            "country": country,
            "param_count": param_count,
            "answer_count": avg,
        }
        record_instance = schemas.RecordCreate(**record_data)
        db_record = crud.create_record(db, record_instance)
        print(db_record)
    return result


@app.get("/api/cleanup")
def get_cleanup_request(id: str):
    clean_up_repo(id)
    print("cleanup " + id + "'s repo")


@app.get("/api/test")
def test_write_indb(db: Session = Depends(get_db)):
    record_data = {
        "id": "yooh",
        "country": "KR",
        "param_count": 500,
        "answer_count": 5444,
    }
    record_instance = schemas.RecordCreate(**record_data)
    db_record = crud.create_record(db, record_instance)
    print(db_record)
    return True


@app.get("/api/rank")
def get_rank_list(page: int, param_count: int, db: Session = Depends(get_db)):
    ranks = crud.get_records(db, skip=page, param_count=param_count, limit=500)
    return ranks


# Catch-all route for non-existent paths
@app.route("/{path:path}")
async def catch_all(path: str):
    # Redirect to the root path
    print("wrong path : ", path)
    return RedirectResponse(url="/", status_code=307)
