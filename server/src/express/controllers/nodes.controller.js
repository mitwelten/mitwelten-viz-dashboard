// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import fileAccessor from '../../dataAccessors/fileAccessor';
import httpsAccessor from '../../dataAccessors/httpAccessor';
import listAllNodes from '../../useCases/listAllNodes';
import listNodeById from '../../useCases/listNodeById';
import listNodesInTimeWindow from '../../useCases/listNodesInTimeWindow';
import { NODE_ID_REGEX } from '../../utils';

const fileAccess = fileAccessor();
const httpAccess = httpsAccessor();

const findAll = (req, res) => {
  const { from, to } = req.query;

  if (from && to) {
    listNodesInTimeWindow(httpAccess, from, to)
      .then((nodes) => res.status(200).json(nodes))
      .catch((error) => res.status(500).json(error));
  } else {
    listAllNodes(fileAccess)
      .then((nodes) => {
        res.status(200).json(nodes);
      })
      .catch(() => {
        listAllNodes(httpAccess)
          .then((nodes) => {
            res.status(200).json(nodes);
          })
          .catch((error) => res.status(500).json(error));
      });
  }
};

const findByNodeId = (req, res) => {
  const { nodeId } = req.params;

  if (!nodeId || !NODE_ID_REGEX.test(nodeId)) {
    res.status(400).json({ message: 'Provided bad node id' });
  } else {
    listNodeById(fileAccess, nodeId)
      .then((node) => {
        res.status(200).json(node);
      })
      .catch(() => {
        listNodeById(httpAccess, nodeId)
          .then((node) => {
            res.status(200).json(node);
          })
          .catch((error) => res.status(404).json(error));
      });
  }
};

export default { findAll, findByNodeId };
