// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { SOCKET_CONNECTION } from '../actions/socket.action';

const initialState = null;

const socketReducer = (state = initialState, action) => {
  if (action.type === SOCKET_CONNECTION) {
    return action.payload;
  }
  return state;
};

export default socketReducer;
