// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import makeEnvSensorData from '../resources/envSensorData';

const listAllEnvSensorData = async (
  dataAccessor,
  limit = 1000,
  afterTimeStamp = ''
) => {
  if (!dataAccessor) {
    throw new Error('No data accessor provided');
  }

  const envSensorData = await dataAccessor.findAllEnvSensorData(
    limit,
    afterTimeStamp
  );

  return envSensorData.map((data) => makeEnvSensorData(data));
};

const listEnvSensorDataByNodeId = async (
  dataAccessor,
  nodeId,
  limit = 1000,
  from = '',
  to = ''
) => {
  if (!dataAccessor) {
    throw new Error('No data accessor provided');
  }

  const envSensorData = await dataAccessor.findEnvSensorDataByNodeId(
    nodeId,
    limit,
    from,
    to
  );

  return envSensorData.map((data) => makeEnvSensorData(data));
};

export { listAllEnvSensorData, listEnvSensorDataByNodeId };
