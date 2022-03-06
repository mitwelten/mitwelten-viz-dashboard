// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import express from 'express';
import urlsController from '../controllers/urls.controller';

const urlsRouter = express.Router();

urlsRouter.get('/', urlsController.findAll);
urlsRouter.get('/images', urlsController.findAllImages);

export default urlsRouter;
