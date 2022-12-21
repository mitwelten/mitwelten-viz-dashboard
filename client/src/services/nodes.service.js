// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import config from '../assets/application.js';

const nodesService = {
  getAll: async () => {
    const response = await fetch(`${config.url}/nodes`);
    const nodes = await response.json();
    return nodes;
  },

  getInTimeRange: async (from, to) => {
    const response = await fetch(
      `${config.url}/nodes?from=${from.toISOString()}&to=${to.toISOString()}`
    );
    const nodes = await response.json();
    return nodes;
  },
};

export default nodesService;
