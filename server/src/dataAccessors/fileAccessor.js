// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { existsSync, readFileSync } from 'fs';
import { PATH_NODES_FILE } from '../utils';

const fileAccessor = () => {
  const findAllNodes = () =>
    new Promise((resolve, reject) => {
      if (existsSync(PATH_NODES_FILE)) {
        const nodesString = readFileSync(PATH_NODES_FILE, 'utf-8');
        resolve(JSON.parse(nodesString));
      }
      reject(new Error('File does not exist'));
    });

  const findNodeById = (nodeId) =>
    new Promise((resolve, reject) => {
      if (existsSync(PATH_NODES_FILE)) {
        const nodesString = readFileSync(PATH_NODES_FILE, 'utf-8');
        const nodes = JSON.parse(nodesString);
        const node = nodes.filter((node_) => node_.node_id === nodeId);
        resolve(node);
      }
      reject(new Error('File does not exist'));
    });

  return {
    findAllNodes,
    findNodeById,
  };
};

export default fileAccessor;
