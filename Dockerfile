FROM python:3.11

WORKDIR /home

RUN . .venv/bin/activate

EXPOSE 8000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", ""]