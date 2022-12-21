import pkg from 'aws-sdk';
import { fileTypeFromBuffer } from 'file-type';

const { S3 } = pkg;

const { ACCESS_KEY, SECRET_KEY, BUCKET_NAME, S3_HOST, S3_PATH } = process.env;

const s3 = new S3({
  endpoint: S3_HOST,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_KEY,
  s3ForcePathStyle: true, 
});

/**
 * @description Promise an upload to S3
 * @param params S3 bucket params
 * @return data/err S3 response object
 */
function promiseUpload(params) {
  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function encode(data) {
  const buf = Buffer.from(data);
  const base64 = buf.toString('base64');
  return base64;
}

async function getFile(name) {
  const data = await s3
    .getObject({
      Bucket: `${BUCKET_NAME}`,
      Key: `${S3_PATH}/${name}`,
    })
    .promise();

  return data;
}

function handleFileBody(base64Str, type) {
  try {
    return new Buffer.from(base64Str.replace(/^data:.+;base64,/, ''), 'base64');
  } catch (e) {
    throw console.error(e);
  }
}

/**
 * @description Uploads an image to S3
 * @param name Image name
 * @param base64Str Image body converted to base 64
 * @param type Image type
 * @return string S3 image URL or error accordingly
 */
async function upload(name, base64Str, type = 'image') {
  const params = {
    Bucket: `${BUCKET_NAME}`,
    Key: `${S3_PATH}/${name}`,
    Body: handleFileBody(base64Str, type),
    ContentType: type,
    Region: "eu-central-1"
  };

  let data;

  try {
    data = await promiseUpload(params);
  } catch (err) {
    console.error(err);

    return '';
  }

  return data.Location;
}

export default { upload, getFile, encode };
