// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { NODE_ID_REGEX } from '../utils';

const makePaxSensorData = ({ node_id: nodeId, voltage, pax, time } = {}) => {
  if (!nodeId) {
    throw new Error('Env Sensor data must have a node_id');
  }

  if (!NODE_ID_REGEX.test(nodeId)) {
    throw new Error(
      'Field node_id of Env Sensor data is expected to have the pattern of 4 digits, dash and another 4 digits'
    );
  }

  if (voltage && voltage < 0) {
    throw new Error(
      'Env Sensor data must contain a non-negative voltage value'
    );
  }

  if (!time) {
    throw new Error('Env Sensor data must have a timestamp');
  }

  if (new Date(time) > new Date()) {
    throw new Error('Env Sensor data timestamp must be in the past');
  }

  return Object.freeze({
    node_id: nodeId,
    voltage,
    voltageUnit: 'V',
    pax,
    paxUnit: '',
    time,
  });
};

export default makePaxSensorData;
