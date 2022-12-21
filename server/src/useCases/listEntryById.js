// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

const listEntryById = async (dataAccessor, entryId) => {
  if (!dataAccessor) {
    throw new Error('No data accessor provided');
  }

  const entry = await dataAccessor.findEntryById(entryId);

  return entry;
};

export default listEntryById;
