#linux alpine server w/node installed gtg
FROM node
WORKDIR /var/www
COPY Tap-Tap-Adventure-master .
RUN npm install -d
EXPOSE 1800
CMD [ "node" , "server/js/main.js" ]
