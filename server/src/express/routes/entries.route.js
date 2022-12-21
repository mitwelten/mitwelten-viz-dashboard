// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import express from 'express';
import entriesController from '../controllers/entries.controller';

const entriesRouter = express.Router();

entriesRouter.get('/', entriesController.findAll);
entriesRouter.get('/:entryId', entriesController.findById);
entriesRouter.post('/update', entriesController.update);
entriesRouter.post('/delete', entriesController.deleteExistingEntry);
entriesRouter.post('/create', entriesController.create);
// entriesRouter.get('/:entryId', entriesController.findByEntryId);

export default entriesRouter;
