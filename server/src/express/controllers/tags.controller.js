// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import httpsAccessor from '../../dataAccessors/httpAccessor';
import listAllTags from '../../useCases/listAllTags';

const httpsAccess = httpsAccessor();

const findAll = (req, res) =>
  listAllTags(httpsAccess)
    .then((tags) => res.status(200).json(tags))
    .catch((error) => res.status(500).json(error));

export default { findAll };
