import React, { Component } from 'react';
import { Navigate, useNavigate } from 'react-router';
import config from '../assets/application.js';

async function sendLogout() {
  return await fetch(`${config.url}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: localStorage.getItem('token'),
  }).then((data) => {
    if (data.status == 200) {
      localStorage.removeItem('token');
      return true;
    } else {
      return false;
    }
    return data.status;
  });
}

export default function Logout() {
  // Delete the token from local storage
  if (localStorage.getItem('token') != null) {
    const loStat = sendLogout();
    console.log(loStat);
  } else {
    console.log('no token in localstorage');
    return <Navigate to="/" replace />;
  }

  // Redirect the user to the login page
  return (
    <div>
      <p>Logged out.</p>
      <a href="/">home</a>
    </div>
  );
}
