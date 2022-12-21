// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import httpsAccessor from '../../dataAccessors/httpAccessor';
import listAllEntries from '../../useCases/listAllEntries';
import listEntryById from '../../useCases/listEntryById';
import updateEntry from '../../useCases/updateEntry';
import deleteEntry from '../../useCases/deleteEntry';
import createEntry from '../../useCases/createEntry';

const httpsAccess = httpsAccessor();

const findAll = (req, res) =>
  listAllEntries(httpsAccess)
    .then((entries) => {
      res.status(200).json(entries)
    })
    .catch((error) => {
      res.status(500).json(error)});

const findById = (req, res) => {
  const { entryId } = req.params;
  listEntryById(httpsAccess, entryId)
    .then((entry) => {
      res.status(200).json(entry)
    })
    .catch((error) => {
      res.status(500).json(error)})
}

const update = (req, res) => {
  updateEntry(httpsAccess, req.body)
    .then((entry) => {
      res.status(200).json(entry);
    })
    .catch((error) => res.status(500).json(error));
};

const deleteExistingEntry = (req, res) => {
  deleteEntry(httpsAccess, req.body)
    .then((entry) => {
      res.status(200).json(entry);
    })
    .catch((error) => res.status(500).json(error));
};

const create = (req, res) => {
  createEntry(httpsAccess, req.body)
    .then((entry) => {
      res.status(200).json(entry);
    })
    .catch((error) => res.status(500).json(error));
  };

export default { findAll, update, create, deleteExistingEntry, findById };
