// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import express from 'express';
import pkg from 'aws-sdk';

const { S3 } = pkg;

const { ACCESS_KEY, SECRET_KEY, BUCKET_NAME, S3_HOST, S3_PATH } = process.env;

const filesRouter = express.Router();

const s3 = new S3({
  endpoint: S3_HOST,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  s3ForcePathStyle: true, 
});

// filesRouter.get('/:fileId', filesController.findById);
filesRouter.get('/:fileId', async (req, res, next) => {
  // create key from user/project/section IDs
  const { fileId } = req.params;

  const params = {
    Key: `${S3_PATH}/${fileId}`,
    Bucket: `${BUCKET_NAME}`,
  };

  s3.getSignedUrl('getObject', params, (err, url) => {
    if (err) {
      console.error(err);
      next(err);
    } else {
      res.json({ url });
    }
  });
});

export default filesRouter;
