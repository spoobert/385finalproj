FROM python:2.7-alpine3.6

COPY requirements.txt /opt/stackdriver/

WORKDIR /opt/stackdriver

RUN apk add --no-cache g++     && pip install -r requirements.txt

COPY app.py .

ENV FLASK_APP app.py

CMD ["flask", "run", "--host=0.0.0.0", "--port=80"]
