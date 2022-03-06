// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React from 'react';
import PropTypes from 'prop-types';
import styles from './InfoPanelContent.module.scss';

const InfoPanelContent = ({ children }) => {
  return <div className={styles.content}>{children}</div>;
};

InfoPanelContent.propTypes = {
  children: PropTypes.node.isRequired,
};

export default InfoPanelContent;
