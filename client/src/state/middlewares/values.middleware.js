// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { setTimeEnd, setTimeStart } from '../actions/time.action';
import { setLoadingState } from '../actions/util.actions';
import {
  LOAD_VALUES,
  loadValuesSuccess,
  LOAD_VALUES_SUCCESS,
} from '../actions/values.action';

const valuesMiddleware = (services) => (store) => (next) => async (action) => {
  next(action);

  if (action.type === LOAD_VALUES) {
    store.dispatch(setLoadingState(true));
    const nodesState = store.getState().nodes;
    const node = nodesState.all.find(
      (n) => n.node_id === nodesState.subscription
    );
    const { rangeStart, rangeEnd } = store.getState().time;
    const values = await services.values.get(node, rangeStart, rangeEnd);
    store.dispatch(loadValuesSuccess(values));
    store.dispatch(setLoadingState(false));
  }

  if (action.type === LOAD_VALUES_SUCCESS) {
    const { start, end } = store.getState().time;
    store.dispatch(setTimeStart(start));
    store.dispatch(setTimeEnd(end));
  }
};

export default valuesMiddleware;
