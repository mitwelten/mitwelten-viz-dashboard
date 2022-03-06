// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import { getLogger, PATH_NODES_FILE } from '../utils';
import makeNode from '../resources/node';

const logger = getLogger();

const saveNodes = async (dataAccessor) => {
  if (!dataAccessor) {
    throw new Error('No data accessor provided');
  }

  const fetchedNodes = await dataAccessor.findAllNodes();
  const nodes = fetchedNodes.map((node) => makeNode(node));
  const nodesString = JSON.stringify(nodes, null, 2);

  try {
    if (existsSync(PATH_NODES_FILE)) {
      const existingNodes = readFileSync(PATH_NODES_FILE, 'utf-8');
      if (nodesString !== existingNodes) {
        writeFileSync(PATH_NODES_FILE, nodesString);
        logger.debug('Changes to existing node file found. Updated now.');
      } else {
        logger.debug('No changes to existing node file');
      }
    } else {
      const folder = path.join(PATH_NODES_FILE, '..');
      if (!existsSync(folder)) {
        mkdirSync(folder);
      }
      writeFileSync(PATH_NODES_FILE, nodesString);
    }
  } catch (error) {
    logger.error(error);
  }
};

export default saveNodes;
