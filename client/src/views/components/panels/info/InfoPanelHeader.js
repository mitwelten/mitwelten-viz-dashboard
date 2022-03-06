// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React from 'react';
import PropTypes from 'prop-types';
import styles from './InfoPanelHeader.module.scss';

const InfoPanelHeader = ({ children, collapsed, onIconClick }) => {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>{children}</h1>
      <span className={styles.rightAligned}>
        <div
          className={`${styles.arrow} ${collapsed ? styles.rotated : ''}`}
          onClick={onIconClick}
          onKeyDown={() => {}}
          role="button"
          tabIndex={0}
        >
          <i className="fas fa-times" />
        </div>
      </span>
    </div>
  );
};

InfoPanelHeader.propTypes = {
  children: PropTypes.node.isRequired,
  collapsed: PropTypes.bool,
  onIconClick: PropTypes.func,
};

InfoPanelHeader.defaultProps = {
  collapsed: false,
  onIconClick: () => {},
};

export default InfoPanelHeader;
