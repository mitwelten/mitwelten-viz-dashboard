// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { createLogger } from 'redux-logger';
import imagesMiddleware from './images.middleware';
import nodesMiddleware from './nodes.middleware';
import timesMiddleware from './time.middleware';
import utilMiddleware from './util.middleware';
import valuesMiddleware from './values.middleware';

const middlewares = [
  imagesMiddleware,
  nodesMiddleware,
  timesMiddleware,
  utilMiddleware,
  valuesMiddleware,
];

if (process.env.NODE_ENV !== 'production') {
  middlewares.push(createLogger);
}

export default middlewares;
