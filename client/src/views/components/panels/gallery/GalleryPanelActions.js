// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import styles from './GalleryPanelActions.module.scss';
import { setImagesInterval } from '../../../../state/actions/images.action';
import { getImageInterval } from '../../../../state/selectors/images.selector';

const GalleryPanelAction = ({ share, exportData }) => {
  const [sharePressing, setSharePressing] = useState(false);
  const [exportPressing, setExportPressing] = useState(false);
  const [exporting, setExporting] = useState(false);

  const interval = useSelector(getImageInterval);

  const dispatch = useDispatch();

  const startExport = async () => {
    if (!exporting) {
      setExporting(true);
      await exportData();
      setExporting(false);
    }
  };

  const intervals = [
    { title: '1 s', value: 1000 },
    { title: '1 min', value: 1000 * 60 },
    { title: '1 h', value: 1000 * 60 * 60 },
    { title: '1 d', value: 1000 * 60 * 60 * 24 },
  ];

  return (
    <>
      <div className={styles.title}>Interval:</div>
      <div className={styles.interval}>
        <span />
        {intervals.map((int) => (
          <React.Fragment key={int.value}>
            <div
              className={interval === int.value ? styles.selected : ''}
              onClick={() => dispatch(setImagesInterval(int.value))}
            >
              {int.title}
            </div>
            <span />
          </React.Fragment>
        ))}
      </div>
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
          className={`${exportPressing ? styles.press : ''} ${
            exporting ? styles.disabled : ''
          }`}
          onClick={startExport}
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
    </>
  );
};

GalleryPanelAction.propTypes = {
  share: PropTypes.func,
  exportData: PropTypes.func,
};

GalleryPanelAction.defaultProps = {
  share: () => {},
  exportData: () => {},
};

export default GalleryPanelAction;
