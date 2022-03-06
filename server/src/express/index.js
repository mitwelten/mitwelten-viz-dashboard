// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { getLogger, loadEnvironment } from '../utils';
import envSensorRouter from './routes/envSensor.route';
import nodesRouter from './routes/nodes.route';
import paxSensorRouter from './routes/paxSensor.route';
import urlsRouter from './routes/urls.route';

// loads env variables & gets the logger
loadEnvironment();
const logger = getLogger();

// read swagger file
const swaggerFile = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', 'swagger', 'swagger.json'),
    'utf-8'
  )
);

// setup application & uses frontend build
const app = express();
app.use(express.static(path.join(__dirname, '..', 'build')));

// all backend requests listens to /api & is able to parse the body
const api = express.Router();
app.use('/api', api);
api.use(express.json());
if (process.env.PROD !== 'true') {
  api.use(cors());
  logger.debug('CORS enabled, because it is DEV environment');
}

// swagger doc
api.use('/', swaggerUi.serve);
api.get('/', swaggerUi.setup(swaggerFile));

// routes
api.use('/nodes', nodesRouter);
api.use('/env', envSensorRouter);
api.use('/pax', paxSensorRouter);
api.use('/urls', urlsRouter);

app.get('*', (req, res) =>
  res.sendFile('index.html', { root: path.join(__dirname, '..', 'build') })
);

export default app;
