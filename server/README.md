# Server of Mitwelten Dashboard

## General

This server is build with [NodeJs](https://nodejs.org/) using the [ExpressJs](https://expressjs.com/) framework.

## Setup Instructions for local dev setup

Prerequisites:
- docker
- docker-compose
- nodejs & npm

### 1. Install Docker

If you have already installed Docker and Docker-Compose, you might skip this step.

Go to the webpage of Docker, navigate to [_get-docker_](https://docs.docker.com/get-docker/) and choose the correct installer for your environment. After the installation process, open a shell or command line prompt of your choise. Type the following command:

```shell
$ docker -v
```

The output should be a version number, just like the following:

```shell
Docker version 20.10.8, build 3967b7d
```

Usually Docker Compose should have been installed automatically with Docker. Please check with the following command:

```shell
$ docker compose --help
```

It should print a overview:

### 2. Install dependencies


```shell
$ cd server
$ npm run dependencies
```

This script installs all depending node modules for front- and backend.

### 3. Build api

Now let's build the frontend and integrate it with the backend server. Therefore type the command to build in your Terminal as shown.

```shell
$ docker-compose build # build all docker images
$ docker-compose up -d # starts up everything in the background
```

Now the pg and api container should have been started!


Your output should look similar to this:

```shell
> [+] Running 2/2
> ⠿ Container mitwelten-fs22-imvs31_postgres_1  Started 
> ⠿ Container mitwelten-fs22-imvs31_api_1       Started
```

You are now able to open the web application from your browser with the url [http://localhost:8080/api](http://localhost:8080/api).


### 4. Build the Frontend
Check out the readme in ../client folder

### 5. Depoly the application
Build all images with:

```shell
$ docker compose build
```

Push the images into the registry
Pull the images on your server
Pull current main branch
Start docker container

```shell
$ docker-compose up -d
```

Your appliation has been deployed!