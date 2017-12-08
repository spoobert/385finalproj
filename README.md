Repository for CS 385: Tap-Tap-Adventure
Tap-Tap-Adventure-master/ contains the application we used as a starting point.
Report.pdf contains our report for the project.

maintenance_scripts/startall.sh will start all of the docker containers needed to
receive Stackdriver webhooks, post to a kafka topic, and consume that topic to
scale Spanner.

maintenance_scripts/spanner_setup contains a python script that will create a
Spanner instance and database of the given value if one does not exist.

The Dockerfile in the root directory will create a docker container of the web
application.