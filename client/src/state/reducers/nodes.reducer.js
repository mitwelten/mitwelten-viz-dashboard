// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import {
  FILTER_NODES_SUCCESS,
  LOAD_NODES_SUCCESS,
  SUBSCRIBE_NODE,
  UNSUBSCRIBE_NODE,
} from '../actions/nodes.action';

const initialState = {
  all: [],
  displayed: [],
  disabled: [],
  subscription: null,
};

const nodesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_NODES_SUCCESS:
      return {
        ...state,
        all: [...action.payload],
        displayed: [...action.payload],
        disabled: [],
      };

    case SUBSCRIBE_NODE:
      return { ...state, subscription: action.payload };

    case UNSUBSCRIBE_NODE:
      return { ...state, subscription: null };

    case FILTER_NODES_SUCCESS:
      return {
        ...state,
        displayed: [...action.payload],
        disabled: state.all.filter(
          (node) =>
            !action.payload.find(
              (displayed) => displayed.node_id === node.node_id
            )
        ),
      };

    default:
      return state;
  }
};

export default nodesReducer;
