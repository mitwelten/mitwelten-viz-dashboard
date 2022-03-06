# Frontend of Mitwelten Dashboard

## General
This frontend is build with [React](https://reactjs.org/).

## Setup Instructions
> *Note: If you simply want to start and use the web application, please follow the instructions in the [`server`](../server) folder. The following instructions are only to start the frontend part without the backend server. You might end up with a web application without meaningful data in it.*

### 1. Install NodeJs & NPM
If you have already installed NodeJs and NPM, you might skip this step.

Go to the webpage of NodeJs, navigate to [*Downloads*](https://nodejs.org/en/download/) and choose the correct installer for your environment. After the installation process, open a shell or command line prompt of your choise. Type the following command:
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
To be able to build and start the application, the node dependencies (also known as *node_modules*) have to be installed. Open your Terminal, navigate to the folder `client` and run the command to install all dependencies as shown.
```shell
$ cd client
$ npm install
```
This script installs all depending node modules for frontend.

## Start instructions
If you want to start only the frontend or want to start it seperately, use the following commands in your Terminal:
```shell
$ cd client
$ npm start
```
Your default browser should open up on the url [http://localhost:3000](http://localhost:300). The terminal output should look similar to this:
```shell
Compiled successfully!

You can now view client in the browser.

  Local:            http://localhost:3000        
  On Your Network:  http://10.195.8.39:3000      

Note that the development build is not optimized.
To create a production build, use npm run build.
```
