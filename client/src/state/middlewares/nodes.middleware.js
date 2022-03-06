// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import {
  filterNodes,
  filterNodesSuccess,
  FILTER_NODES,
  loadNodesSuccess,
  LOAD_NODES,
  SUBSCRIBE_NODE,
  UNSUBSCRIBE_NODE,
} from '../actions/nodes.action';
import { setLoadingState } from '../actions/util.actions';

const nodesMiddleware = (services) => (store) => (next) => async (action) => {
  next(action);

  switch (action.type) {
    case LOAD_NODES: {
      store.dispatch(setLoadingState(true));
      const nodes = await services.nodes.getAll();
      store.dispatch(loadNodesSuccess(nodes));
      store.dispatch(setLoadingState(false));
      store.dispatch(filterNodes);
      break;
    }

    case FILTER_NODES: {
      const startTime = store.getState().time.start;
      const endTime = store.getState().time.end;
      const displayedNodes = await services.nodes.getInTimeRange(
        new Date(startTime),
        new Date(endTime)
      );
      store.dispatch(filterNodesSuccess(displayedNodes));
      break;
    }

    case SUBSCRIBE_NODE:
      store.getState().socket?.emit('join-node', action.payload);
      break;

    case UNSUBSCRIBE_NODE:
      store.getState().socket?.emit('leave-node');
      break;

    default:
      break;
  }
};

export default nodesMiddleware;
