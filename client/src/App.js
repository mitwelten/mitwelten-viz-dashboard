// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import useToken from './hooks/useToken';
import { Route, Routes, Navigate, Outlet } from 'react-router';
import { io } from 'socket.io-client';
import { loadNodes } from './state/actions/nodes.action';
import { socketConnection } from './state/actions/socket.action';
import FilterBar from './views/components/FilterBar';
import NotFound from './views/NotFound';
import MapContainer from './views/containers/MapContainer';
import EntriesContainer from './views/containers/EntriesContainer';
import Interviews from './views/Interviews';
import Logout from './views/Logout';
import Login from './views/Login';
import Evaluations from './views/Evaluations';
import styles from './App.module.scss';

const ProtectedRoute = ({ token, redirectPath = '/login', children }) => {
  if (!token) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

ProtectedRoute.propTypes = {
  token: PropTypes.string,
  redirectPath: PropTypes.string,
  children: PropTypes.node,
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#37DE8A',
    },
    secondary: {
      main: 'rgb(44, 48, 59)',
    },
  },
});

const App = () => {
  const dispatch = useDispatch();
  const { token, setToken } = useToken();

  useEffect(() => {
    dispatch(loadNodes);
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.relativePositioning}>
            <Routes>
              <Route path="/login" element={<Login setToken={setToken} />} />
              <Route element={<ProtectedRoute token={token} />}>
                <Route path="/entries" element={<EntriesContainer />} />
              </Route>
              <Route path="/logout" element={<Logout />} />
              <Route path="/" element={<MapContainer />} />
              <Route path="/evaluations" element={<Evaluations />} />
              <Route path="/interviews" element={<Interviews />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
        <div className={styles.menuBottom}>
          <FilterBar />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
