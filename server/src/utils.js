// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import dotenv from 'dotenv-extended';
import log4js from 'log4js';
import path from 'path';

// setup logger
const logger = log4js.getLogger('Dashboard');
logger.level = 'INFO';

// returns logger instance
const getLogger = () => logger;

// loads env variables
const loadEnvironment = () => {
  dotenv.load({ defaults: '.env.default' });
  logger.level = process.env.LOG_LEVEL || 'INFO';
};

const addQuery = (url, key, value) => {
  if (url.includes('?')) {
    return `${url}&${key}=${value}`;
  }
  return `${url}?${key}=${value}`;
};

const NODE_ID_REGEX = /^\d{4}-\d{4}$/;

const URL_REGEX =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/;

const PATH_NODES_FILE = path.join(__dirname, '..', 'assets', 'nodes.json');

export {
  getLogger,
  loadEnvironment,
  addQuery,
  NODE_ID_REGEX,
  URL_REGEX,
  PATH_NODES_FILE,
};
