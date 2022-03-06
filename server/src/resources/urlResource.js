// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { URL_REGEX } from '../utils';

const urlResource = ({ url }) => {
  if (!url) {
    throw new Error('No URL provided');
  }

  if (!URL_REGEX.test(url)) {
    throw new Error('Provided url does not match a regular URL pattern');
  }

  return Object.freeze({ url });
};

export default urlResource;
