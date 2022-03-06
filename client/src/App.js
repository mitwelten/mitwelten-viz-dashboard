// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router';
import { io } from 'socket.io-client';
import { loadNodes } from './state/actions/nodes.action';
import { socketConnection } from './state/actions/socket.action';
import Menu from './views/components/Menu';
import NotFound from './views/NotFound';
import MapContainer from './views/containers/MapContainer';
import Interviews from './views/Interviews';
import Evaluations from './views/Evaluations';
import styles from './App.module.scss';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(socketConnection(io()));
    dispatch(loadNodes);
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.menuTop}>
        <Menu />
      </div>
      <div className={styles.content}>
        <div className={styles.relativePositioning}>
          <Routes>
            <Route path="/" element={<MapContainer />} />
            <Route path="/interviews" element={<Interviews />} />
            <Route path="/evaluations" element={<Evaluations />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
      <div className={styles.menuBottom}>
        <Menu />
      </div>
    </div>
  );
};

export default App;
