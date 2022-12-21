# The instructions for the first stage
FROM node:16.8.0-alpine3.14

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

RUN mkdir -p /usr/src/app
RUN chmod -R 777 /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY . /usr/src/app

CMD [ "npm", "run", "start:prod" ]