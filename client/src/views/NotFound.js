// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <>
      <h1>404 - Not found</h1>
      <Link to="/">
        <p>Navigate back to Home</p>
      </Link>
    </>
  );
};

export default NotFound;
