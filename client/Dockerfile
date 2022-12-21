FROM node:16-bullseye-slim as builder

WORKDIR /home/node/app
COPY . .

RUN npm i
RUN npm run build
RUN npm install -g serve 

CMD ["serve", "-l", "3000", "-s", "build"]

