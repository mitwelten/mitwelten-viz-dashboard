// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { NODE_ID_REGEX } from '../utils';

const makeNode = (node) => {
  if (!node.id) {
    throw new Error('Every node must have a node_id');
  }

  if (!NODE_ID_REGEX.test(node.name)) {
    throw new Error(
      'Field node_id is expected to have the pattern of 4 digits, dash and another 4 digits'
    );
  }

  if (!node.location.lat || !node.location.lon) {
    throw new Error('Provided location is not valid');
  }

  if (!node.type) {
    throw new Error('Every node must have a type declaration');
  }

  return {
    id: node.id,
    node_id: node.name,
    location: {
      latitude: node.location.lat,
      longitude: node.location.lon,
    },
    type: node.type,
    platform: node.platform,
    description: node.description,
  };
};

export default makeNode;
