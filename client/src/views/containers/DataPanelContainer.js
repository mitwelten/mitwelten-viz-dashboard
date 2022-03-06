// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useEffect, useState } from 'react';
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

const DataPanelContainer = () => {
  const [collapsed, setCollapsed] = useState(false);

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

  useEffect(() => {
    socket?.on('data', () => dispatch(loadValues));
  }, [socket, dispatch]);

  useEffect(() => {
    if (subscription) {
      setCollapsed(false);
      dispatch(loadValues);
    }
  }, [subscription]);

  return (
    <>
      <div
        className={`${styles.container} ${
          collapsed ? styles.containerCollapsed : ''
        }`}
      >
        {subscription && (
          <>
            <DataPanelHeader
              collapsed={collapsed}
              onIconClick={() => {
                setCollapsed(true);
                setTimeout(() => dispatch(unsubscribeNode), 400);
              }}
            >
              {subscription}
            </DataPanelHeader>
            <DataPanelContent>
              <div className={styles.panelContent}>
                {values.length > 0 &&
                  Object.keys(values[0])
                    .filter(
                      (key) =>
                        !['node_id', 'time', 'voltage'].includes(key) &&
                        !key.toLowerCase().includes('unit')
                    )
                    .map((key) => (
                      <div key={key} className={styles.sensorDataContainer}>
                        <Chart property={key} />
                      </div>
                    ))}
              </div>
            </DataPanelContent>
            <DataPanelAction
              share={() => dispatch(copyURLToClipboard)}
              exportData={exportData}
            />
          </>
        )}
      </div>
    </>
  );
};

export default DataPanelContainer;
