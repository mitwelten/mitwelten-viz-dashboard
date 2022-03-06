// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import express from 'express';
import paxSensorController from '../controllers/paxSensor.controller';

const paxSensorRouter = express.Router();

paxSensorRouter.get('/', paxSensorController.findAll);
paxSensorRouter.get('/:nodeId', paxSensorController.findByNodeId);

export default paxSensorRouter;
