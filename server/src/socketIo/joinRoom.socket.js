// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

const listenToRoomJoin = (socket) => {
  socket.on('join-node', (nodeId) => {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });

    socket.join(nodeId);
  });
};

export default listenToRoomJoin;
