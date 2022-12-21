// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { subscribeNode } from '../../state/actions/nodes.action';
import { useDispatch, useSelector } from 'react-redux';
import { unsubscribeNode } from '../../state/actions/nodes.action';
import { loadValues } from '../../state/actions/values.action';
import { getSubscription } from '../../state/selectors/nodes.selector';
import { copyURLToClipboard } from '../../state/actions/util.actions';
import getSocket from '../../state/selectors/socket.selector';
import getValues from '../../state/selectors/values.selector';
import DataPanelContent from '../components/panels/data/DataPanelContent';
import DataPanelHeader from '../components/panels/data/DataPanelHeader';
import styles from './DataPanelContainer.module.scss';
import Chart from '../components/Chart';
import DataPanelAction from '../components/panels/data/DataPanelActions';

const DataPanelContainer = ({ node, nodesToCompare, onClose }) => {
  console.log('nodesToCompare', nodesToCompare);
  const socket = useSelector(getSocket);
  const subscription = useSelector(getSubscription);
  const values = useSelector(getValues);

  const dispatch = useDispatch();

  const exportData = () => {
    const blob = new Blob([JSON.stringify(values, null, 2)], {
      type: 'text/json',
    });
    const a = document.createElement('a');
    a.download = `mitwelten-${subscription}.json`;
    a.href = window.URL.createObjectURL(blob);
    a.dispatchEvent(
      new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      })
    );
    a.remove();
  };

  return (
    <>
      <DataPanelHeader
        onIconClick={() => {
          onClose();
        }}
      >
        {nodesToCompare.map((n, index) => (
          <Typography
            variant="h6"
            key={index}
            sx={{
              color: `rgb(${38 * index}, ${155 * index}, ${96 * index})`,
              display: 'inline',
            }}
          >
            {n.node_id}
            {index + 1 !== nodesToCompare.length && ', '}
          </Typography>
        ))}
      </DataPanelHeader>
      <DataPanelContent>
        <div>
          <div className={styles.panelContent}>
            {node.type === 'pax' ? (
              <div className={styles.sensorDataContainer}>
                <Chart property={node.type} nodesToCompare={nodesToCompare} />
              </div>
            ) : (
              ['humidity', 'moisture', 'temperature'].map((type, index) => (
                <div key={index} className={styles.sensorDataContainer}>
                  <Chart property={type} nodesToCompare={nodesToCompare} />
                </div>
              ))
            )}
          </div>
        </div>
      </DataPanelContent>
      <DataPanelAction
        share={() => dispatch(copyURLToClipboard)}
        exportData={exportData}
      />
    </>
  );
};

DataPanelContainer.propTypes = {
  collapseGallery: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  popupState: PropTypes.object,
  node: PropTypes.object,
  close: PropTypes.func,
  anchorEl: PropTypes.object,
  nodesToCompare: PropTypes.array,
};

export default DataPanelContainer;
