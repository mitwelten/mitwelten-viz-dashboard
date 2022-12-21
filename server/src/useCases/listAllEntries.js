// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.
import { getLogger } from '../utils';

const listAllEntries = async (httpsAccess) => {
  getLogger().info('use case');
  if (!httpsAccess) {
    throw new Error('No data accessor provided');
  }

  const entries = await httpsAccess.findAllEntries();

  return entries;
};

export default listAllEntries;
