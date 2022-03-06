// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { Server } from 'socket.io';
import { getLogger, loadEnvironment } from '../utils';
import listenToRoomJoin from './joinRoom.socket';
import listenToRoomLeave from './leaveRoom.socket';
import { registerForDataNotification } from './notifyOnDataChange';

const registerConnections = (io) => {
  io.on('connection', (socket) => {
    getLogger().debug(`Socket connection opened by ${socket.id}`);

    socket.on('disconnect', (reason) => {
      getLogger().debug(`Socket ${socket.id} disconnected: (${reason})`);
    });

    listenToRoomJoin(socket);
    listenToRoomLeave(socket);
  });

  registerForDataNotification(io);
};

const socketIo = () => {
  loadEnvironment();

  const bindToServer = (server, options = {}) => {
    let serverOptions = options;
    if (process.env.PROD !== 'true') {
      serverOptions = {
        ...options,
        cors: {
          origin: '*',
          methods: ['GET', 'POST'],
        },
      };
    }

    const io = new Server(server, serverOptions);
    registerConnections(io);
  };

  return {
    bindToServer,
  };
};

export default socketIo;
