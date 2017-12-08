import string
import sys
import logging
import json

from flask import Flask
from flask import Response, request
from pykafka import KafkaClient

logging.basicConfig()
logger = logging.getLogger(__name__)

app = Flask("stackdriver-webhook-receiver")
client = KafkaClient(zookeeper_hosts="zookeeper")

topics = ['spanner_scaler']
for item in topics:
	client.topics[item]

@app.route('/spannerUnderloaded', methods=['POST'])
def spannderUnderloaded():
    # Handle a webhook post with basic HTTP authentication
    auth = request.authorization

    if not auth or not _check_basic_auth(auth.username, auth.password):
        error_msg = '401 Could not verify your access level for that URL. You have to login with proper credentials'
        logger.error(error_msg)
        return Response(error_msg, 401, {'WWW-Authenticate': 'Basic realm="Login Required"'})
    else:
	# Add another node
	logger.warn("Spanner underloaded, removing a node.")
	topic = client.topics['spanner_scaler']
	with topic.get_sync_producer(max_queued_messages=0, linger_ms=0) as producer:
		producer.produce('scale_down')	

        return Response("OK")

@app.route('/spannerOverloaded', methods=['POST'])
def spannerOverloaded():
    # Handle a webhook post with basic HTTP authentication
    auth = request.authorization

    if not auth or not _check_basic_auth(auth.username, auth.password):
        error_msg = '401 Could not verify your access level for that URL. You have to login with proper credentials'
        logger.error(error_msg)
        return Response(error_msg, 401, {'WWW-Authenticate': 'Basic realm="Login Required"'})
    else:


	# Add another node
	logger.warn("Spanner overloaded, allocating additonal node.")
	topic = client.topics['spanner_scaler']
	with topic.get_sync_producer(max_queued_messages=0, linger_ms=0) as producer:
		producer.produce('scale_up')	
        
	return Response("OK")

def _check_basic_auth(username, password):
    return username == '<USERNAME>' and password == '<PASSWORD>'
