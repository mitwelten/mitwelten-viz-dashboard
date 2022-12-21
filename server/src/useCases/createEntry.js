// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.
import { getLogger } from '../utils';
import manageTags from "./manageTags";
import manageFiles from "./manageFiles";

const logger = getLogger();

const createEntry = async (httpsAccess, entry) => {
  if (!httpsAccess) {
    throw new Error('No data accessor provided');
  }

  try {
    const entryObj = {
      name: entry.name,
      description: entry.description,
      date: entry.date,
      location: entry.location,
    }

    const newEntry = await httpsAccess.createEntry(entryObj);

    if (entry?.tags?.length > 0) {
      const res = await manageTags(httpsAccess, entry, newEntry.id)
      console.log("tags", res)
    }

    if (entry?.files?.length > 0) {
      const res = await manageFiles(httpsAccess, entry, newEntry.id)
      console.log("resFilescreate", res)
    }

    return newEntry
  } catch (err) {
    throw err
  }
};

export default createEntry;
