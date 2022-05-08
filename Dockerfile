FROM node:16

WORKDIR /article_server

COPY . /article_server

RUN npm install

RUN npm install express --save

RUN npm i --save cors express mongoose body-parser

EXPOSE 8080

ENTRYPOINT [ "node", "server.js" ]