from google.cloud import spanner

# The GCLOUD_PROJECT environment variable should be specified with a value
# equal to the name of the Google Cloud project id.
# The GOOGLE_APPLICATION_CREDENTIALS environment variable should be specified
# with a value equal to the location of the api key.

# This script will try to create the GoogleSpanner instance and database if
# they do not already exist.

instance_name = "<SPANNER_INSTANCE_ID_HERE>"
db_name = "<DATABASE_ID_HERE>"
region = "<INSTANCE_LOCATION_HERE>" # Available regions can be found at
									# https://cloud.google.com/spanner/docs/instances#available-configurations-regional
									# eg us-central1


mInstance = None
foundInstance = False
mDatabase = None
foundDatabase = False

spanner_client = spanner.Client()

# Get all instances for project and try to find our own instance
for instance in spanner_client.list_instances():
	if(instance_name in instance.instance_id):
		foundInstance = True
		mInstance = instance
		break

# Create an instance if one does not exist
if(not foundInstance):
	mConfig = None

	for config in spanner_client.list_instance_configs():
		# We want the config for the region we will be deploying in
		if(region in config.display_name):
			mConfig = config
			break

	instance = spanner_client.instance(instance_name,
	                                   configuration_name=mConfig.name,
	                                   node_count=1,
	                                   display_name="<INSTANCE_NAME>")
	operation = instance.create()
	# This will wait until the instance is created before moving on
	operation.result()
	instance.reload()
	mInstance = instance

# Look through the databases in the instance to try and find ours
for database in mInstance.list_databases():
	if(db_name in database.database_id):
		foundDatabase = True
		mDatabase = database
		break

# Create the database if it does not exist
if(not foundDatabase):
	mDatabase = mInstance.database(db_name)
	operation = mDatabase.create()
	# Same thing, wait until the db is created before moving on
	operation.result()