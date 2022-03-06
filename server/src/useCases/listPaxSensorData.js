// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import makePaxSensorData from '../resources/paxSensorData';

const listAllPaxSensorData = async (
  dataAccessor,
  limit = 1000,
  from = '',
  to = ''
) => {
  if (!dataAccessor) {
    throw new Error('No data accessor provided');
  }
  const paxSensorData = await dataAccessor.findAllPaxSensorData(
    limit,
    from,
    to
  );

  return paxSensorData.map((data) => makePaxSensorData(data));
};

const listPaxSensorDataByNodeId = async (
  dataAccessor,
  nodeId,
  limit = 1000,
  from = '',
  to = ''
) => {
  if (!dataAccessor) {
    throw new Error('No data accessor provided');
  }
  const paxSensorData = await dataAccessor.findPaxSensorDataByNodeId(
    nodeId,
    limit,
    from,
    to
  );

  return paxSensorData.map((data) => makePaxSensorData(data));
};

export { listAllPaxSensorData, listPaxSensorDataByNodeId };
