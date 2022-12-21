import config from '../assets/application';

export const allEntries = async () => {
  try {
    let res = await fetch(`${config.url}/entries`);
    res = await res.json();
    return res;
  } catch (err) {
    console.log('err', err);
  }
};

export const entryById = async (id) => {
  try {
    let res = await fetch(`${config.url}/entries/${id}`);
    res = await res.json();
    return res;
  } catch (err) {
    console.log('err', err);
  }
};

export const getS3File = async (name) => {
  try {
    let res = await fetch(`${config.url}/files/${name}`);
    res = await res.json();
    return res;
  } catch (err) {
    console.log('err', err);
  }
};
