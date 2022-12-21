// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import httpsAccessor from '../../dataAccessors/httpAccessor';
import listFileById from '../../useCases/listFileById';

const httpAccess = httpsAccessor();

const findById = (req, res) => {
  const { fileId } = req.params;
  listFileById(httpAccess, fileId)
    .then((file) => res.status(200).json(file))
    .catch((file) => res.status(500).json(file));
  }

export default { findById };
