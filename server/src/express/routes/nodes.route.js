// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import express from 'express';
import nodesController from '../controllers/nodes.controller';

const nodesRouter = express.Router();

nodesRouter.get('/', nodesController.findAll);
nodesRouter.get('/:nodeId', nodesController.findByNodeId);

export default nodesRouter;
