// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import httpsAccessor from '../../dataAccessors/httpAccessor';
import listUrls from '../../useCases/listUrls';

const findAll = (req, res) => {
  const { from, to } = req.query;

  listUrls(httpsAccessor(), from, to)
    .then((nodes) => res.status(200).json(nodes))
    .catch((error) => res.status(500).json(error));
};

const findAllImages = (req, res) => {
  const { from, to } = req.query;

  listUrls(httpsAccessor(), from, to)
    .then((nodes) => res.status(200).json(nodes))
    .catch((error) => res.status(500).json(error));
};

export default { findAll, findAllImages };
