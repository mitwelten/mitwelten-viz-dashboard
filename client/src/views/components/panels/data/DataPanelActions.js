// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './DataPanelActions.module.scss';

const DataPanelAction = ({ share, exportData }) => {
  const [sharePressing, setSharePressing] = useState(false);
  const [exportPressing, setExportPressing] = useState(false);

  return (
    <div className={styles.actions}>
      <div
        className={sharePressing ? styles.press : ''}
        onClick={share}
        onMouseDown={() => setSharePressing(true)}
        onMouseUp={() => setSharePressing(false)}
        onMouseLeave={() => setSharePressing(false)}
        onTouchStart={() => setSharePressing(true)}
        onTouchEnd={() => setSharePressing(false)}
      >
        <i className="fas fa-share-square" />
        Teilen
      </div>
      <div
        className={exportPressing ? styles.press : ''}
        onClick={exportData}
        onMouseDown={() => setExportPressing(true)}
        onMouseUp={() => setExportPressing(false)}
        onMouseLeave={() => setExportPressing(false)}
        onTouchStart={() => setExportPressing(true)}
        onTouchEnd={() => setExportPressing(false)}
      >
        <i className="fas fa-file-download" />
        Exportieren
      </div>
    </div>
  );
};

DataPanelAction.propTypes = {
  share: PropTypes.func,
  exportData: PropTypes.func,
};

DataPanelAction.defaultProps = {
  share: () => {},
  exportData: () => {},
};

export default DataPanelAction;
