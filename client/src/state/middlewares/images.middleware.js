// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { loadImagesSuccess, LOAD_IMAGES } from '../actions/images.action';
import { setLoadingState } from '../actions/util.actions';

const imagesMiddleware = (services) => (store) => (next) => async (action) => {
  next(action);

  if (action.type === LOAD_IMAGES) {
    store.dispatch(setLoadingState(true));
    const { time } = store.getState();
    const imageUrls = await services.urls.getAllImages(time.start, time.end);
    store.dispatch(loadImagesSuccess(imageUrls));
    store.dispatch(setLoadingState(false));
  }
};

export default imagesMiddleware;
