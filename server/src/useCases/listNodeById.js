// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import makeNode from '../resources/node';

const listNodeById = async (dataAccessor, nodeId) => {
  if (!dataAccessor) {
    throw new Error('No data accessor provided');
  }

  const [node] = await dataAccessor.findNodeById(nodeId);

  return makeNode(node);
};

export default listNodeById;
