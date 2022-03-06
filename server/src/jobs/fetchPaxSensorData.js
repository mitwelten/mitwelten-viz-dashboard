// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import httpsAccessor from '../dataAccessors/httpAccessor';
import { notifyOnDataChange } from '../socketIo/notifyOnDataChange';
import { listAllPaxSensorData } from '../useCases/listPaxSensorData';

let lastModifiedAt = new Date(0);

const accessor = httpsAccessor();

const fetchPaxSensorData = async () => {
  const paxData = await listAllPaxSensorData(
    accessor,
    100,
    lastModifiedAt.toISOString()
  );

  if (paxData.length > 0) {
    const leastTimeStamp = new Date(paxData[0].time);
    if (leastTimeStamp > lastModifiedAt) {
      lastModifiedAt = new Date(leastTimeStamp.getTime() + 100);
      notifyOnDataChange(paxData);
    }
  }
};

export default fetchPaxSensorData;
