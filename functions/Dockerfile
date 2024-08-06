FROM node:lts-alpine
WORKDIR /application

COPY package.json /application
RUN npm install

RUN apk update
RUN apk upgrade
RUN apk add --no-cache ffmpeg

COPY . /application 

EXPOSE 3000/tcp
ENTRYPOINT ["node", "server.mjs"]
