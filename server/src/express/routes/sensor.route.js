// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import express from 'express';
import sensorController from '../controllers/sensorValues.controller';

const sensorRouter = express.Router();

sensorRouter.get('/:nodeId', sensorController.findByNodeId);

export default sensorRouter;
