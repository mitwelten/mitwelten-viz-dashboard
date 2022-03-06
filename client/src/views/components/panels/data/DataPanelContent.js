// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React from 'react';
import PropTypes from 'prop-types';
import styles from './DataPanelContent.module.scss';

const DataPanelContent = ({ children }) => {
  return <div className={styles.content}>{children}</div>;
};

DataPanelContent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DataPanelContent;
