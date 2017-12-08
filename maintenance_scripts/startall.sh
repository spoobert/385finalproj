docker run --rm -d --name zookeeper zookeeper:3.4.11
docker run --rm -d --link zookeeper --name kafka kafka-cs385:alpine
sleep 5
docker run --rm -d --link kafka  --link zookeeper -p 5000:5000 -p80:80 --name stackdriver stackdriver
sleep 5
docker run --rm -d --link kafka  --link zookeeper --name spanner_scaler spanner_scaler
