// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import axios from 'axios';
import { urlToHttpOptions } from 'url';
import { addQuery, loadEnvironment, URL_REGEX } from '../utils';
import filesService from '../resources/filesService';

const formatDateStringToDbFormat = (date) =>
  `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}T${date.toLocaleTimeString()}`;

const addTimeWindowToPath = (path, from, to) => {
  let pathWithTimeWindow = path;

  if (from.length > 0) {
    const localeTimeStamp = formatDateStringToDbFormat(new Date(from));
    pathWithTimeWindow = addQuery(
      pathWithTimeWindow,
      'time',
      `gte.${localeTimeStamp}`
    );
  }

  if (to.length > 0) {
    const localeTimeStamp = formatDateStringToDbFormat(new Date(to));
    pathWithTimeWindow = addQuery(
      pathWithTimeWindow,
      'time',
      `lte.${localeTimeStamp}`
    );
  }

  return pathWithTimeWindow;
};

const uploadFile = async (i) => {
  const base64File = i.file;
  const fileName = i.name;
  const fileType = i.type;

  let response;

  try {
    response = await filesService.upload(fileName, base64File, fileType);
  } catch (err) {
    console.error(`Error uploading image: ${err.message}`);
    return new Error(`Error uploading image: ${fileName}`);
  }

  return response;
};

const downloadFile = async (id) => {
  let response;
  try {
    const image = await Image.findByPk(id);

    response = await filesService.getFile(image.name);
    response = filesService.encode(response.Body);
    response = { ...image.get({ plain: true }), content: response };
  } catch (err) {
    console.error(`Error downloading file: ${err.message}`);
    return new Error(`Error downloading file: ${fileLink}`);
  }

  return response;
};

const httpsAccessor = () => {
  loadEnvironment();

  const makeRequest = (url, path, requestType = 'get', requestBody = null) =>
    axios({
      method: requestType,
      data: {
        ...requestBody,
      },
      baseURL: url,
      url: path,
      auth: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
      },
    })
      .then((res) => {
        console.log('request::', `${url}${path}`, requestType, requestBody);
        console.log('response::', res.data);
        return res.data;
      })
      .catch((err) => {
        console.log('request error::', err);
        throw err?.response?.data || err.message;
      });

  if (!process.env.DATABASE_URL) {
    throw new Error(
      'The http accessor needs a url to fetch data. No DATABASE_URL provided in environment.'
    );
  }

  if (!URL_REGEX.test(process.env.DATABASE_URL)) {
    throw new Error(
      `The http accessor needs a valid url to fetch data. Received URL: ${process.env.DATABASE_URL}`
    );
  }

  const findSensorDataByNodeId = (nodeId, limit = 100, from = '', to = '') => {
    let path = `/data/${nodeId}`;
    path = !!from && `${path}?from=${from}`;
    path = !!to && `${path}&to=${to}`;

    if (limit && +limit > 0) {
      path = addQuery(path, 'limit', limit);
    }
    return makeRequest(process.env.DATABASE_URL, path);
  };

  const findAllEntries = (from, to) => {
    const path =
      !!from && !!to
        ? `/entries?from=${from ?? ''}&to=${to ?? ''}`
        : '/entries';
    return makeRequest(process.env.DATABASE_URL, path);
  };

  const findEntryById = (id) => {
    const path = `/entry/${id}`;
    return makeRequest(process.env.DATABASE_URL, path);
  };

  const updateEntry = (entryToBeUpdated) => {
    const path = `/entry/${entryToBeUpdated.id}`;
    return makeRequest(
      process.env.DATABASE_URL,
      path,
      'patch',
      entryToBeUpdated
    );
  };

  const createEntry = (entry) => {
    const path = '/entries';
    return makeRequest(process.env.DATABASE_URL, path, 'post', entry);
  };

  const deleteEntry = (entry) => {
    const path = `/entry/${entry.id}`;
    return makeRequest(process.env.DATABASE_URL, path, 'delete');
  };

  const createTag = (tag) => {
    const path = '/tag';
    return makeRequest(process.env.DATABASE_URL, path, 'put', tag);
  };

  const addTagToEntry = (id, tag) => {
    const path = `/entry/${id}/tag`;
    return makeRequest(process.env.DATABASE_URL, path, 'post', tag);
  };

  const addFileToEntry = (id, file) => {
    const path = `/entry/${id}/file`;
    return makeRequest(process.env.DATABASE_URL, path, 'post', file);
  };

  const deleteFile = (file) => {
    const path = `/file/${file.id}`;
    return makeRequest(process.env.DATABASE_URL, path, 'delete');
  };

  const deleteTagFromEntry = (id, tag) => {
    const path = `/entry/${id}/tag`;
    return makeRequest(process.env.DATABASE_URL, path, 'delete', tag);
  };

  const findAllTags = (from, to) => {
    const path =
      !!from && !!to ? `/tags?from=${from ?? ''}&to=${to ?? ''}` : '/tags';
    return makeRequest(process.env.DATABASE_URL, path);
  };
  const findAllNodes = (from, to) => {
    const path =
      !!from && !!to ? `/nodes?from=${from ?? ''}&to=${to}` : '/nodes';
    return makeRequest(process.env.DATABASE_URL, path);
  };

  const findNodeById = (nodeId) => {
    const path = addQuery('/node', 'node_id', `eq.${nodeId}`);
    return makeRequest(process.env.DATABASE_URL, path);
  };

  const findAllUrls = (from = '', to = '') => {
    let path = 'images/';
    if (from) {
      path = addQuery(path, 'from', from);
    }

    if (to) {
      path = addQuery(path, 'to', to);
    }

    return makeRequest('https://mitwelten-backend.herokuapp.com/api/', path);
  };

  return {
    findSensorDataByNodeId,
    findAllNodes,
    findNodeById,
    findAllUrls,
    uploadFile,
    downloadFile,
    findAllEntries,
    findEntryById,
    updateEntry,
    deleteEntry,
    createEntry,
    findAllTags,
    createTag,
    addTagToEntry,
    deleteTagFromEntry,
    addFileToEntry,
    deleteFile,
  };
};

export default httpsAccessor;
