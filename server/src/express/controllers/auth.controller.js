import jwt from 'jsonwebtoken';
import NodeCache from 'node-cache';
import { User } from '../../../db/database';
import hashIt from '../../utils/crypt';

// Stores refresh token until logout or expiry default 24h (86400 seconds)
const tokeCache = new NodeCache();

const cacheToken = async (token) => {
  tokeCache.set(token, token, 86400);
};

const removeToken = async (token) => {
  tokeCache.del(token);
};

const tokenExists = async (token) => !!tokeCache.get(token);

const createRefreshToken = async (user) => {
  const jwtcontent = { email: user.email };
  return new Promise((res, rej) => {
    jwt.sign(
      jwtcontent,
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '24h',
      },
      (err, token) => {
        if (err) {
          console.log(err);
          rej();
        }
        cacheToken(token);
        res(token);
      }
    );
  });
};

const createAuthToken = async (user) => {
  const jwtcontent = { email: user.email };
  return new Promise((res, rej) => {
    jwt.sign(
      jwtcontent,
      process.env.TOKEN_SECRET,
      {
        expiresIn: '15m',
      },
      (err, token) => {
        if (err) {
          console.log(err);
          rej();
        }
        res(token);
      }
    );
  });
};

const verifyRefreshTokenAndCreateAuthToken = async (refreshToken) =>
  new Promise((res, rej) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, data) => {
        if (err) {
          console.log(err);
          rej();
        }
        const authToken = await createAuthToken({
          email: data.email,
        });
        res(authToken);
      }
    );
  });

export const login = async (req, res) => {
  if (
    !req.body ||
    !req.body.email ||
    !req.body.password ||
    req.body.email === '' ||
    req.body.password === ''
  ) {
    res.status(401).send({ errorMessage: 'Please provide credentials' });
  } else {
    const credentials = req.body;
    hashIt(credentials.password, async (hashedPw) => {
      const user = await User.findOne({
        logging: false,
        where: { email: credentials.email, password: hashedPw },
      });
      if (!user) {
        res.status(401).send({ errorMessage: 'Authentication failed' });
      } else {
        try {
          const token = await createAuthToken({
            email: user.email,
          });
          const refreshToken = await createRefreshToken({
            email: user.email,
          });
          res.status(200).send({
            token,
            refreshToken,
          });
        } catch (e) {
          console.log(e);
          res.status(500).send({
            errorMessage: 'Authentication failed',
          });
        }
      }
    });
  }
};

// Removes refreshtoken from cache
export const logout = async (req, res) => {
  if (!req.body || (req.body && !req.body.token)) {
    res.status(500).send({ errorMessage: 'Please provide token' });
  }
  const { token } = req.body;
  const tokenIsSet = await tokenExists(token);
  if (tokenIsSet) {
    removeToken(token);
  }
  res.sendStatus(200);
};

// Generates an new auth token using refresh token
export const token = async (req, res) => {
  if (!req.body || (req.body && !req.body.token)) {
    res.status(500).send({ errorMessage: 'Please provide token' });
  } else {
    const refreshToken = req.body.token;
    const tokenIsSet = await tokenExists(refreshToken);
    if (!tokenIsSet) {
      res.sendStatus(403);
    } else {
      const authToken = await verifyRefreshTokenAndCreateAuthToken(
        refreshToken
      );
      res.status(200).send({
        token: authToken,
      });
    }
  }
};
