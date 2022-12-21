import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

import config from '../assets/application.js';

export default function Login({ setToken }) {
  const [email, setEmail] = useState();
  const navigate = useNavigate();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  async function loginUser(credentials) {
    setLoading(true);
    return fetch(`${config.url}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    }).then((data) => {
      return data.json();
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await loginUser({
      email,
      password,
    });
    await setToken(token);
    setLoading(false);
    navigate('/entries');
  };

  return (
    <div className="login-wrapper">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid item xs={1} sx={{ width: '400px' }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <h2>Einloggen</h2>
              <TextField
                id="user"
                label="Benutzername"
                disabled={loading}
                variant="outlined"
                fullWidth
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                id="password"
                label="Passwort"
                type="password"
                disabled={loading}
                variant="outlined"
                fullWidth
                onChange={(e) => setPassword(e.target.value)}
              />
              <div>
                <Button variant="contained" disabled={loading} type="submit">
                  Login
                </Button>
              </div>
            </Stack>
          </form>
        </Grid>
      </Grid>
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};
