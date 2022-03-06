// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

export const LOAD_NODES = '[NODES] load';
export const LOAD_NODES_SUCCESS = '[NODES] load success';

export const SUBSCRIBE_NODE = '[NODES] subscribe to node';
export const UNSUBSCRIBE_NODE = '[NODES] unsubscribe to node';

export const FILTER_NODES = '[NODES] filter';
export const FILTER_NODES_SUCCESS = '[NODES] filter success';

export const loadNodes = { type: LOAD_NODES };

export const loadNodesSuccess = (nodes) => ({
  type: LOAD_NODES_SUCCESS,
  payload: nodes,
});

export const subscribeNode = (nodeId) => ({
  type: SUBSCRIBE_NODE,
  payload: nodeId,
});

export const filterNodes = { type: FILTER_NODES };

export const filterNodesSuccess = (nodes) => ({
  type: FILTER_NODES_SUCCESS,
  payload: nodes,
});

export const unsubscribeNode = { type: UNSUBSCRIBE_NODE };
