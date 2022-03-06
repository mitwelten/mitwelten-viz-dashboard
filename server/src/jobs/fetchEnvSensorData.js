// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import httpsAccessor from '../dataAccessors/httpAccessor';
import { notifyOnDataChange } from '../socketIo/notifyOnDataChange';
import { listAllEnvSensorData } from '../useCases/listEnvSensorData';

let lastModifiedAt = new Date(0);

const accessor = httpsAccessor();

const fetchEnvSensorData = async () => {
  const envData = await listAllEnvSensorData(
    accessor,
    100,
    lastModifiedAt.toISOString()
  );

  if (envData.length > 0) {
    const leastTimeStamp = new Date(envData[0].time);
    if (leastTimeStamp > lastModifiedAt) {
      lastModifiedAt = new Date(leastTimeStamp.getTime() + 100);
      notifyOnDataChange(envData);
    }
  }
};

export default fetchEnvSensorData;
