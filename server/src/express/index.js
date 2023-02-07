// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { getLogger, loadEnvironment } from '../utils';
import sensorRouter from './routes/sensor.route';
import entriesRouter from './routes/entries.route';
import filesRouter from './routes/files.route';
import tagsRouter from './routes/tags.route';
import nodesRouter from './routes/nodes.route';
import { login, logout, token } from './controllers/auth.controller';
import urlsRouter from './routes/urls.route';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
api.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb' }));
if (process.env.PROD !== 'true') {
  api.use(cors());
  logger.debug('CORS enabled, because it is DEV environment');
}

// swagger doc
api.use('/', swaggerUi.serve);
api.get('/', swaggerUi.setup(swaggerFile));

// routes
api.use('/login', login);
api.use('/logout', logout);
api.use('/nodes', nodesRouter);
api.use('/data', sensorRouter);
api.use('/urls', urlsRouter);
api.use('/entries', entriesRouter);
api.use('/files', filesRouter);
api.use('/tags', tagsRouter);

app.get('*', (req, res) =>
  res.sendFile('index.html', { root: path.join(__dirname, '..', 'build') })
);

export default app;
