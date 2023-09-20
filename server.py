from typing import Annotated
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
import sys
import os
from git import Repo

app = FastAPI()

templates = Jinja2Templates(directory="public")


@app.get("/")
async def get_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


class Item(BaseModel):
    url: str


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
