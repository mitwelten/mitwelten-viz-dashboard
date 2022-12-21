import { pbkdf2 } from 'crypto';
import process from 'process';

const hashIt = async (value, callback) => {
  if (!process.env.SALT) {
    throw Error('No salt provided');
  }
  try {
    pbkdf2(value, process.env.SALT, 92000, 64, 'sha512', (err, derivedKey) => {
      if (err) {
        throw err;
      }
      callback(derivedKey.toString('hex'));
    });
  } catch (e) {
    console.log(e);
  }
};

export default hashIt;
