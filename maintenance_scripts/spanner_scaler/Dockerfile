FROM python:2.7-alpine3.6

COPY requirements.txt /opt/spanner_scaler/

WORKDIR /opt/spanner_scaler

RUN apk add --no-cache g++ && pip install -r requirements.txt

ENV GOOGLE_APPLICATION_CREDENTIALS apikey.json
ENV SPANNER_PROJECT_ID="<GOOGLE_CLOUD_PROJECT_ID>"
ENV SPANNER_MAX_NODES="3"
ENV SPANNER_INSTANCE_ID="<SPANNER_INSTANCE_ID>"
ENV SPANNER_REGION="<SPANNER_INSTANCE_REGION>"
ENV SPANNER_INSTANCE_NAME="<SPANNER_INSTANCE_NAME>"
ENV SPANNER_NODE_COUNT="1"

COPY apikey.json .
COPY app.py .

CMD ["python", "app.py"]
