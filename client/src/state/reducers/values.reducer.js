// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import {
  FILTER_VALUES_FROM,
  FILTER_VALUES_TO,
  LOAD_VALUES_SUCCESS,
} from '../actions/values.action';

const initialState = {
  all: [],
  filteredValues: [],
  fromFilter: (value) => value,
  toFilter: (value) => value,
};

const valuesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_VALUES_SUCCESS:
      return { ...state, all: [...action.payload] };

    case FILTER_VALUES_FROM:
      return {
        ...state,
        filteredValues: state.all.filter(action.payload).filter(state.toFilter),
        fromFilter: action.payload,
      };

    case FILTER_VALUES_TO:
      return {
        ...state,
        filteredValues: state.all
          .filter(action.payload)
          .filter(state.fromFilter),
        toFilter: action.payload,
      };

    default:
      return state;
  }
};

export default valuesReducer;
