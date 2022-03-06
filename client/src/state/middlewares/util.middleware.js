// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { COPY_URL_TO_CLIPBOARD } from '../actions/util.actions';

const utilMiddleware = () => (store) => (next) => async (action) => {
  next(action);

  if (action.type === COPY_URL_TO_CLIPBOARD) {
    const { time, nodes } = store.getState();
    const host = window.location.origin;
    const from = new Date(time.start).getTime();
    const to = new Date(time.end).getTime();
    const url = `${host}?from=${from}&to=${to}${
      nodes.subscription ? `&node=${nodes.subscription}` : ''
    }`;
    navigator.share({
      title: 'Mitwelten',
      url,
    });
  }
};

export default utilMiddleware;
