FROM node:lts-alpine
WORKDIR /application

COPY package.json /application
RUN npm install

COPY . /application 

EXPOSE 3000/tcp
ENTRYPOINT ["node", "server.mjs"]
