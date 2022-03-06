// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import urlResource from '../resources/urlResource';

const listUrls = async (dataAccessor, from = '', to = '') => {
  if (!dataAccessor) {
    throw new Error('No data accessor provided');
  }

  const urls = await dataAccessor.findAllUrls(from, to);

  return urls.map((url) =>
    urlResource({
      url: `https://mitwelten-backend.herokuapp.com/api/images/${url}`,
    })
  );
};

export default listUrls;
