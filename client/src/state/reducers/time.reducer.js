// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import {
  SET_TIME_START,
  SET_TIME_END,
  SET_RANGE_START,
  SET_RANGE_END,
} from '../actions/time.action';

const initialState = {
  start: new Date(new Date().setDate(new Date().getDate() - 2)),
  end: new Date(),
  rangeStart: new Date(new Date().setDate(new Date().getDate() - 2)),
  rangeEnd: new Date(),
};

const timeReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TIME_START:
      return { ...state, start: action.payload };

    case SET_TIME_END:
      return { ...state, end: action.payload };

    case SET_RANGE_START:
      return {
        ...state,
        rangeStart: action.payload,
        start: new Date(
          Math.max(
            new Date(action.payload).getTime(),
            new Date(state.start).getTime()
          )
        ),
      };

    case SET_RANGE_END:
      return {
        ...state,
        rangeEnd: action.payload,
        end: new Date(
          Math.min(
            new Date(action.payload).getTime(),
            new Date(state.end).getTime()
          )
        ),
      };

    default:
      return state;
  }
};

export default timeReducer;
