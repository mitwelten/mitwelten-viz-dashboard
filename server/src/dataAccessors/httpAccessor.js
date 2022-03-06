// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import https from 'https';
import { addQuery, loadEnvironment, URL_REGEX } from '../utils';

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

const makeRequest = (url, path) =>
  new Promise((resolve, reject) => {
    try {
      const request = https.get(`${url}/${path}`, (response) => {
        let responseData = '';
        response.on('data', (data) => {
          responseData += data;
        });

        response.on('end', () => resolve(JSON.parse(responseData)));
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.end();
    } catch (error) {
      reject(error);
    }
  });

const httpsAccessor = () => {
  loadEnvironment();

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

  const findAllEnvSensorData = (limit = 100, from = '', to = '') => {
    let path = '/envsensordata?order=time.desc';

    if (limit && +limit > 0) {
      path = addQuery(path, 'limit', limit);
    }

    path = addTimeWindowToPath(path, from, to);

    return makeRequest(process.env.DATABASE_URL, path);
  };

  const findEnvSensorDataByNodeId = (
    nodeId,
    limit = 100,
    from = '',
    to = ''
  ) => {
    let path = addQuery(
      '/envsensordata?order=time.desc',
      'node_id',
      `eq.${nodeId}`
    );

    if (limit && +limit > 0) {
      path = addQuery(path, 'limit', limit);
    }

    path = addTimeWindowToPath(path, from, to);

    return makeRequest(process.env.DATABASE_URL, path);
  };

  const findAllPaxSensorData = (limit = 100, from = '', to = '') => {
    let path = '/paxsensordata?order=time.desc';

    if (limit && +limit > 0) {
      path = addQuery(path, 'limit', limit);
    }

    path = addTimeWindowToPath(path, from, to);

    return makeRequest(process.env.DATABASE_URL, path);
  };

  const findPaxSensorDataByNodeId = (
    nodeId,
    limit = 100,
    from = '',
    to = ''
  ) => {
    let path = addQuery(
      '/paxsensordata?order=time.desc',
      'node_id',
      `eq.${nodeId}`
    );

    if (limit && +limit > 0) {
      path = addQuery(path, 'limit', limit);
    }

    path = addTimeWindowToPath(path, from, to);

    return makeRequest(process.env.DATABASE_URL, path);
  };

  const findAllNodes = () => {
    const path = '/node';
    return makeRequest(process.env.DATABASE_URL, path);
  };

  const findNodeById = (nodeId) => {
    const path = addQuery('/node', 'node_id', `eq.${nodeId}`);
    return makeRequest(process.env.DATABASE_URL, path);
  };

  const findNodesInTimeWindow = async (from, to) => {
    try {
      const localeFrom = formatDateStringToDbFormat(new Date(from));
      const localeTo = formatDateStringToDbFormat(new Date(to));

      let paxPath = 'paxsensordata';
      paxPath = addQuery(paxPath, 'time', `gte.${localeFrom}`);
      paxPath = addQuery(paxPath, 'time', `lte.${localeTo}`);
      const paxDataInRange = await makeRequest(
        process.env.DATABASE_URL,
        paxPath
      );

      let envPath = 'envsensordata';
      envPath = addQuery(envPath, 'time', `gte.${localeFrom}`);
      envPath = addQuery(envPath, 'time', `lte.${localeTo}`);
      const envDataInRange = await makeRequest(
        process.env.DATABASE_URL,
        envPath
      );

      const nodeIdsInRange = [
        ...new Set(
          [...paxDataInRange, ...envDataInRange].map((data) => data.node_id)
        ),
      ];
      const nodes = await findAllNodes();

      const nodesInRange = nodes.filter((node) =>
        nodeIdsInRange.includes(node.node_id)
      );

      return new Promise((resolve) => resolve(nodesInRange));
    } catch (error) {
      return new Promise((resolve, reject) => reject(error));
    }
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
    findAllEnvSensorData,
    findEnvSensorDataByNodeId,
    findAllPaxSensorData,
    findPaxSensorDataByNodeId,
    findAllNodes,
    findNodeById,
    findNodesInTimeWindow,
    findAllUrls,
  };
};

export default httpsAccessor;
