// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import config from '../assets/application.js';

const urlsService = {
  getAllImages: async (from, to) => {
    const response = await fetch(
      `${config.url}/urls/images?from=${new Date(
        from
      ).toISOString()}&to=${new Date(to).toISOString()}`
    );
    const urls = await response.json();
    return urls.map((urlObj) => urlObj.url);
  },
};

export default urlsService;
