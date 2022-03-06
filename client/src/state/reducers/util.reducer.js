// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { LOADING_STATE_OFF, LOADING_STATE_ON } from '../actions/util.actions';

const initialState = {
  loading: false,
};

const utilReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOADING_STATE_ON:
      return { ...state, loading: true };

    case LOADING_STATE_OFF:
      return { ...state, loading: false };

    default:
      return state;
  }
};

export default utilReducer;
