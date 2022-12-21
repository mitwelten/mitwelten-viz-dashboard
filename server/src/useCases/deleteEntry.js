// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.
import { getLogger } from '../utils';
import manageTags from "./manageTags";
import manageFiles from "./manageFiles";

const logger = getLogger();

const deleteEntry = async (httpsAccess, entry) => {
  if (!httpsAccess) {
    throw new Error('No data accessor provided');
  }

  try {

    const res = await httpsAccess.deleteEntry(entry);
    return res
  } catch (err) {
    throw err
  }
};

export default deleteEntry;
