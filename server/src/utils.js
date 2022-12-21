// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.
import { fileURLToPath } from 'url';

import dotenv from 'dotenv-extended';
import log4js from 'log4js';
import path from 'path';
import { readFile } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// setup logger
const logger = log4js.getLogger('Dashboard');
logger.level = 'INFO';

const jsonReader = (filePath, cb) => {
  readFile(filePath, (err, fileData) => {
    if (err) {
      return cb && cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (err) {
      return cb && cb(err);
    }
  });
};

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
const PATH_ENTRIES_FILE = path.join(__dirname, '..', 'assets', 'entries.json');

export {
  jsonReader,
  getLogger,
  loadEnvironment,
  addQuery,
  NODE_ID_REGEX,
  URL_REGEX,
  PATH_NODES_FILE,
  PATH_ENTRIES_FILE,
};
