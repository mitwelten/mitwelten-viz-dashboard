// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.
import { getLogger } from '../utils';

const listAllTags = async (httpsAccess) => {
  if (!httpsAccess) {
    throw new Error('No data accessor provided');
  }

  const tags = await httpsAccess.findAllTags();

  return tags;
};

export default listAllTags;
