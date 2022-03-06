# Server of Mitwelten Dashboard

## General

This server is build with [NodeJs](https://nodejs.org/) using the [ExpressJs](https://expressjs.com/) framework.

## Setup Instructions

### 1. Install NodeJs & NPM

If you have already installed NodeJs and NPM, you might skip this step.

Go to the webpage of NodeJs, navigate to [_Downloads_](https://nodejs.org/en/download/) and choose the correct installer for your environment. After the installation process, open a shell or command line prompt of your choise. Type the following command:

```shell
$ node -v
```

The output should be a version number, just like the following:

```shell
v14.15.4
```

Usually NPM should have been installed automatically with NodeJs. Please check with the following command:

```shell
$ npm -v
```

Again, it should print a valid version number like:

```shell
7.24.1
```

### 2. Install dependencies

To be able to build and start the application, the node dependencies (also known as _node_modules_) have to be installed. Open your Terminal, navigate to the folder `server` and run the command to install all dependencies as shown.

```shell
$ cd server
$ npm run dependencies
```

This script installs all depending node modules for front- and backend.

### 3. Build frontend

Now let's build the frontend and integrate it with the backend server. Therefore type the command to build in your Terminal as shown.

```shell
$ cd server
$ npm run build
```

Now you should have a folder named `build` in your `server` folder.

## Start instructions

If you have followed the [Setup instructions](#setup-instructions), everything should be ready to start the application. Open your Terminal and type the following:

```shell
$ cd server
$ npm start
```

Your output should look similar to this:

```shell
> mitwelten-dashboard@1.0.0 start
> node dist/server.js || (npm run integrate && node dist/server.js)

[2021-09-29T16:05:06.244] [INFO] Dashboard - Server started on port 8080
```

You are now able to open the web application from your browser with the url [http://localhost:8080](http://localhost:8080).
