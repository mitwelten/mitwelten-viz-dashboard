// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.
import { getLogger } from '../utils';

const listFileById = async (httpAccess, id) => {
  getLogger().info('use case');
  if (!httpAccess) {
    throw new Error('No data accessor provided');
  }

  const file = await httpAccess.downloadFile(id);

  return file;
};

export default listFileById;
