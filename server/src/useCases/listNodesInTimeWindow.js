// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import makeNode from '../resources/node';

const listNodesInTimeWindow = async (dataAccessor, from, to) => {
  if (!dataAccessor) {
    throw new Error('No data accessor provided');
  }

  const nodes = await dataAccessor.findNodesInTimeWindow(from, to);

  return nodes.map((node) => makeNode(node));
};

export default listNodesInTimeWindow;
