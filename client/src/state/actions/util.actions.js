// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

export const LOADING_STATE_ON = '[UTIL] loading state on';
export const LOADING_STATE_OFF = '[UTIL] loading state off';

export const COPY_URL_TO_CLIPBOARD = '[UTIL] copy URL to clipboard';

export const setLoadingState = (state) => ({
  type: state ? LOADING_STATE_ON : LOADING_STATE_OFF,
});

export const copyURLToClipboard = { type: COPY_URL_TO_CLIPBOARD };
