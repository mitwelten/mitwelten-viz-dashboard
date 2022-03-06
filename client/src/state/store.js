// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { applyMiddleware, createStore } from 'redux';
import middlewares from './middlewares/middlewares';
import reducers from './reducers/reducers';

const store = (services) => {
  return createStore(
    reducers,
    applyMiddleware(...middlewares.map((m) => m(services)))
  );
};

export default store;
