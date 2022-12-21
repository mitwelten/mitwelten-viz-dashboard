// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { createServer } from 'http';
import app from './express/index';
import runScheduledJobs from './jobs';
import socketIo from './socketIo';
import { getLogger, loadEnvironment } from './utils';

import { sequelize } from '../db/database';

const start = async () => {
  sequelize.sync();
};

loadEnvironment();
runScheduledJobs();
start();

// setting up server
const httpServer = createServer(app);
socketIo().bindToServer(httpServer);

// starts the web server
httpServer.listen(process.env.PORT || 8080, () =>
  getLogger().info(`Server started on port ${process.env.PORT || 8080}`)
);
