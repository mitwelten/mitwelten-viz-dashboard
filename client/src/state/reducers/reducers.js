// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { combineReducers } from 'redux';
import imagesReducer from './images.reducer';
import nodesReducer from './nodes.reducer';
import socketReducer from './socket.reducer';
import timeReducer from './time.reducer';
import utilReducer from './util.reducer';
import valuesReducer from './values.reducer';

export default combineReducers({
  images: imagesReducer,
  nodes: nodesReducer,
  socket: socketReducer,
  time: timeReducer,
  util: utilReducer,
  values: valuesReducer,
});
