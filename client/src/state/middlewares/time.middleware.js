// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { SET_TIME_END, SET_TIME_START } from '../actions/time.action';
import { filterValuesFrom, filterValuesTo } from '../actions/values.action';

const timesMiddleware = () => (store) => (next) => async (action) => {
  next(action);

  if (action.type === SET_TIME_START) {
    const startTime = action.payload;
    const filter = (value) =>
      new Date(value.time).getTime() > new Date(startTime).getTime();
    store.dispatch(filterValuesFrom(filter));
  }

  if (action.type === SET_TIME_END) {
    const endTime = action.payload;
    const filter = (value) =>
      new Date(value.time).getTime() < new Date(endTime).getTime();
    store.dispatch(filterValuesTo(filter));
  }
};

export default timesMiddleware;
