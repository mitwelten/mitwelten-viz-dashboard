// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import express from 'express';
import envSensorController from '../controllers/envSensor.controller';

const envSensorRouter = express.Router();

envSensorRouter.get('/', envSensorController.findAll);
envSensorRouter.get('/:nodeId', envSensorController.findByNodeId);

export default envSensorRouter;
