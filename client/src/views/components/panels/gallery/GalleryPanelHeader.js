// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React from 'react';
import PropTypes from 'prop-types';
import styles from './GalleryPanelHeader.module.scss';

const GalleryPanelHeader = ({ children, collapsed, onIconClick }) => {
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

GalleryPanelHeader.propTypes = {
  children: PropTypes.node.isRequired,
  collapsed: PropTypes.bool,
  onIconClick: PropTypes.func,
};

GalleryPanelHeader.defaultProps = {
  collapsed: false,
  onIconClick: () => {},
};

export default GalleryPanelHeader;
