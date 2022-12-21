// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import config from '../assets/application.js';

const valuesService = {
  get: async (node, from, to) => {
    const response = await fetch(
      `${config.url}/data/${node.node_id}?from=${new Date(
        from
      ).toISOString()}&to=${new Date(to).toISOString()}&limit=32768`
    );
    const values = await response.json();
    return values;
  },
};

export default valuesService;
