// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import {
  LOAD_IMAGES_SUCCESS,
  SET_IMAGES_INTERVAL,
} from '../actions/images.action';

const initialState = {
  urls: [],
  interval: 1000,
};

const imagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_IMAGES_SUCCESS:
      return { ...state, urls: [...action.payload] };

    case SET_IMAGES_INTERVAL: {
      return { ...state, interval: action.payload };
    }

    default:
      return state;
  }
};

export default imagesReducer;
