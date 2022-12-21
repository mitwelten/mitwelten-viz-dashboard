// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import manageTags from "./manageTags";
import manageFiles from "./manageFiles";

const updateEntry = async (httpsAccess, entry) => {
  if (!httpsAccess) {
    throw new Error('No data accessor provided');
  }


  try {
    const entryId = entry.id
    const tags = await manageTags(httpsAccess, entry, entryId)
    console.log("tags:", tags)

    const files = await manageFiles(httpsAccess, entry, entryId)
    console.log("files:", files)


    const entryObj = {
      id: entry.id,
      name: entry.name,
      description: entry.description,
      date: entry.date,
      location: entry.location,
    }

    const res = await httpsAccess.updateEntry(entryObj);
    console.log("resEntry", res)
    return res;
  } catch (err) {
    console.log("error", err)
    throw err
  }
};

export default updateEntry;
