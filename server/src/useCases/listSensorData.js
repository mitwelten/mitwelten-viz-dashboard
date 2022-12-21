// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import makeSensorData from '../resources/sensorData';

const listSensorDataByNodeId = async (
  dataAccessor,
  nodeId,
  limit = 1000,
  from = '',
  to = ''
) => {
  if (!dataAccessor) {
    throw new Error('No data accessor provided');
  }

  const sensorData = await dataAccessor.findSensorDataByNodeId(
    nodeId,
    limit,
    from,
    to
  );

  return sensorData.map((data) => makeSensorData(data));
};

export { listSensorDataByNodeId };
