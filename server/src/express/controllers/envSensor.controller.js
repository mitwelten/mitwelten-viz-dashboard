// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import httpsAccessor from '../../dataAccessors/httpAccessor';
import { NODE_ID_REGEX } from '../../utils';
import {
  listAllEnvSensorData,
  listEnvSensorDataByNodeId,
} from '../../useCases/listEnvSensorData';

const accessor = httpsAccessor();

const findAll = (req, res) => {
  const { limit, from, to } = req.query;

  listAllEnvSensorData(accessor, limit, from, to)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => res.status(500).json(error));
};

const findByNodeId = (req, res) => {
  const { nodeId } = req.params;
  const { limit, from, to } = req.query;

  if (!nodeId || !NODE_ID_REGEX.test(nodeId)) {
    res.status(400).json({ message: 'Provided bad node id' });
  } else {
    listEnvSensorDataByNodeId(accessor, nodeId, limit, from, to)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((error) => res.status(500).json(error));
  }
};

export default { findAll, findByNodeId };
