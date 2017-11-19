#puts the user in a shell with access to maradb schema
 docker run -it --link tta-db:mysql --rm mariadb sh -c 'exec mysql -h"$MYSQL_PORT_3306_TCP_ADDR" -P"$MYSQL_PORT_3306_TCP_PORT" -uroot -p"$MYSQL_ENV_MYSQL_ROOT_PASSWORD" ttadb'

#to play inside a container with same image
↑125 385/385finalproj git:(master) ▶ docker run -it --link tta-db:mysql --rm tta bash


 #do something with the db and the container
 docker run -ia stdin --link tta-db:mysql --rm mariadb sh -c 'exec mysql -h"$MYSQL_PORT_3306_TCP_ADDR" -P"$MYSQL_PORT_3306_TCP_PORT" -uroot -p"$MYSQL_ENV_MYSQL_ROOT_PASSWORD" ttadb' < ./Tap-Tap-Adventure-master/tools/database.sql

#find env variables to setup in .js file
▶ docker run -it --link tta-db:mysql --rm tta env

docker run --link tta-db:mysql tta

#sets up the mariadb container(persists after docker kill container)
 ▶ docker run --name tta-db -e MYSQL_ROOT_PASSWORD=t9bvjEaerP -d mariadb:10.3

