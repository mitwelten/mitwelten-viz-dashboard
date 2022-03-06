// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

export const SOCKET_CONNECTION = '[SOCKET] connection';

export const socketConnection = (socket) => ({
  type: SOCKET_CONNECTION,
  payload: socket,
});
