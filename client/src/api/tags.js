import config from '../assets/application';

export const tags = async () => {
  try {
    let res = await fetch(`${config.url}/tags`);
    res = await res.json();
    return res;
  } catch (err) {
    console.log('err', err);
  }
};
