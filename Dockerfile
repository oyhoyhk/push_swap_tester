FROM python:3.11

RUN apt-get update -y

# RUN apt-get remove -y gcc build-essential

# RUN apt-get install -y clang

WORKDIR /app

COPY .venv /app/.venv

RUN . .venv/bin/activate

COPY . /app

RUN pip install -r requirements.txt

VOLUME /app/data

EXPOSE 8000

ENTRYPOINT ["uvicorn", "server:app", "--host", "0.0.0.0", "--workers", "4"]