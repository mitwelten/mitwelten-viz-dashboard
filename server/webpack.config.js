// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { fileURLToPath } from 'url';

import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/server.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },
  mode: 'development',
  externals: [nodeExternals()],
  devServer: {
    compress: true,
    allowedHosts: 'all',
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: [/node_modules/, /.test.jsx?$/],
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    ],
  },
};
