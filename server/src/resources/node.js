// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { NODE_ID_REGEX } from '../utils';

const makeNode = ({
  node_id: nodeId,
  location_id: locationId,
  type,
  description,
} = {}) => {
  if (!nodeId) {
    throw new Error('Every node must have a node_id');
  }

  if (!NODE_ID_REGEX.test(nodeId)) {
    throw new Error(
      'Field node_id is expected to have the pattern of 4 digits, dash and another 4 digits'
    );
  }

  if (!locationId) {
    throw new Error('Every node must have a location_id');
  }

  if (!Number.isInteger(locationId)) {
    throw new Error('Provided location_id is not a number');
  }

  if (!type) {
    throw new Error('Every node must have a type declaration');
  }

  if (type !== 'env' && type !== 'pax') {
    throw new Error("Declared type must be 'env' or 'pax'");
  }

  return Object.freeze({
    node_id: nodeId,
    location_id: locationId,
    type,
    description,
  });
};

export default makeNode;
