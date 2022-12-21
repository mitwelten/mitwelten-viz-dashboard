// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import express from 'express';
import tagsController from '../controllers/tags.controller';

const tagsRouter = express.Router();

tagsRouter.get('/', tagsController.findAll);

export default tagsRouter;
