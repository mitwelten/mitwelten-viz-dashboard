// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import styles from './Menu.module.scss';

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      text: 'Map',
      iconClass: 'fas fa-map-marked-alt',
      path: '/',
    },
    {
      text: 'Interviews',
      iconClass: 'fas fa-microphone-alt',
      path: '/interviews',
    },
    {
      text: 'Auswertungen',
      iconClass: 'fas fa-poll',
      path: '/evaluations',
    },
  ];

  return (
    <div className={styles.container}>
      {menuItems.map((menuItem) => (
        <button
          className={location.pathname === menuItem.path ? styles.active : ''}
          key={menuItem.text}
          type="button"
          onClick={() => navigate(menuItem.path)}
        >
          <i className={menuItem.iconClass} />
          <span>{menuItem.text}</span>
        </button>
      ))}
    </div>
  );
};

export default Menu;
