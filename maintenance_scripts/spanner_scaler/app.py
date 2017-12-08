import os
import time
from google.cloud import spanner
from pykafka import KafkaClient

SPANNER_MAX_NODES = int(os.environ['SPANNER_MAX_NODES']) # all caps cause that makes it more important
spanner_project_id = str(os.environ['SPANNER_PROJECT_ID'])
spanner_instance_id = str(os.environ['SPANNER_INSTANCE_ID'])
spanner_region = str(os.environ['SPANNER_REGION'])
spanner_instance_name = str(os.environ['SPANNER_INSTANCE_NAME'])
spanner_node_count = int(os.environ['SPANNER_NODE_COUNT'])

kafka_client = KafkaClient(zookeeper_hosts="zookeeper")
spanner_client = spanner.Client(project=spanner_project_id)
spanner_instance = spanner_client.instance(spanner_instance_id)
spanner_instance.reload()

last_spanner_scale = int(round(time.time()))


topic = kafka_client.topics['spanner_scaler']
consumer = topic.get_simple_consumer()
for message in consumer:
	current_time = int(round(time.time()))

	if(True): #(current_time - last_spanner_scale < 120): #120 seconds
		if("scale_up" in message.value):
			print("receieved scale up")
			if(spanner_instance.node_count < SPANNER_MAX_NODES):
				print("scaling up")
				last_spanner_scale = current_time
				print(spanner_instance.node_count)
				spanner_instance.node_count = spanner_instance.node_count + 1
				print(spanner_instance.node_count)
				operation = spanner_instance.update()
				operation.result()
				spanner_instance.reload()
		elif("scale_down" in message.value):
			print("received scale down")
			if(spanner_instance.node_count > 1):
				print("scaling down")
				last_spanner_scale = current_time
				spanner_instance.node_count = spanner_instance.node_count - 1
				operation = spanner_instance.update()
				operation.result()
				spanner_instance.reload()
