// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { scheduleJob } from 'node-schedule';
import fetchAndSaveNodes from './fetchAndSaveNodes';
import fetchEnvSensorData from './fetchEnvSensorData';
import fetchPaxSensorData from './fetchPaxSensorData';

const jobs = [
  {
    name: 'nodes',
    interval: '0 * * * *',
    method: fetchAndSaveNodes,
  },
  {
    name: 'pax',
    interval: '* * * * *',
    method: fetchPaxSensorData,
  },
  {
    name: 'env',
    interval: '* * * * *',
    method: fetchEnvSensorData,
  },
];

const runScheduledJobs = () => {
  jobs.forEach((job) => {
    job.method();
    scheduleJob(job.name, job.interval, () => job.method());
  });
};

export default runScheduledJobs;
