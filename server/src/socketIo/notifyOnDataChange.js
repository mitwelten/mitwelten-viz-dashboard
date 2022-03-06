// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

let io;

const registerForDataNotification = (socketIo) => {
  io = socketIo;
};

const notifyOnDataChange = (data) => {
  if (io) {
    data.forEach((entry) => io.to(entry.node_id).emit('data', entry));
  }
};

export { registerForDataNotification, notifyOnDataChange };
