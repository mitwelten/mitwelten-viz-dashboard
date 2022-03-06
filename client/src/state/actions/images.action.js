// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

export const LOAD_IMAGES = '[IMAGES] load all';
export const LOAD_IMAGES_SUCCESS = '[IMAGES] load all success';

export const SET_IMAGES_INTERVAL = '[IMAGES] set interval';

export const loadImages = { type: LOAD_IMAGES };

export const loadImagesSuccess = (imageUrls) => ({
  type: LOAD_IMAGES_SUCCESS,
  payload: imageUrls,
});

export const setImagesInterval = (interval) => ({
  type: SET_IMAGES_INTERVAL,
  payload: interval,
});
