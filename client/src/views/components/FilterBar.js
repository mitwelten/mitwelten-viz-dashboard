// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useSearchParams } from 'react-router-dom';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { sub, isBefore, isAfter } from 'date-fns';
import Stack from '@mui/material/Stack';
import { styled, useTheme } from '@mui/material/styles';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Fab } from '@mui/material';

const FilterBar = ({ tags, showInfoModal }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();

  const query = Object.fromEntries([...searchParams]);

  const onChange = (name, value) => {
    if (!!!value && !!query[name]) {
      const newKeys = Object.keys(query).filter((key) => key !== name);
      setSearchParams(newKeys.reduce((o, k) => ({ ...o, [k]: query[k] }), {}));
    } else {
      setSearchParams({ ...query, [name]: value });
    }
  };

  useEffect(() => {
    let params = null;
    if (!query.fs1 && !query.fs2) {
      params = { fs1: true };
    }
    if (!query.pax && !query.env && !query.audio && !query.optical) {
      params = { ...params, env: true };
    }

    setSearchParams({ ...query, ...params });
  }, []);

  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [dateTo, setDateTo] = React.useState(new Date());

  const handleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = [
    {
      text: 'Über das Projekt',
      iconClass: 'fas fa-solid fa-info',
      // iconClass: 'fas fa-info',
      path: 'info',
      hidden: isMobile,
    },
    {
      text: 'Login',
      // text: 'Entries',
      iconClass: 'fas fa-solid fa-sign-in-alt',
      path: '/entries',
    },
    {
      text: 'Logout',
      // iconClass: 'fas fa-poll',
      iconClass: 'fas fa-solid fa-sign-out-alt',
      path: '/logout',
    },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Fab
        aria-label="open"
        onClick={() => handleDrawer()}
        color="primary"
        sx={{
          position: 'fixed',
          right: !open ? 20 : 410,
          top: 20,
        }}
      >
        {open ? <ChevronRightIcon /> : <MenuIcon />}
      </Fab>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        anchor="right"
        variant="persistent"
      >
        <List
          sx={{
            width: '380px',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <Stack spacing={3} sx={{ flex: 1 }}>
            <Box sx={{ paddingX: 3 }}>
              <Stack direction="row" alignItems="center">
                <h3>
                  Mitwelten — Medienökologische Infrastrukturen für
                  Biodiversität
                </h3>
                {isMobile && (
                  <div>
                    <IconButton onClick={() => handleDrawer()}>
                      <ChevronRightIcon />
                    </IconButton>
                  </div>
                )}
              </Stack>
            </Box>
            <Box sx={{ padding: 3, flex: 1, backgroundColor: '#f9f9f9' }}>
              <Stack spacing={5}>
                <Box>
                  <Typography variant="overline" display="block" gutterBottom>
                    Nach Datum eingrenzen
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="flex-end">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <MobileDatePicker
                        disableFuture
                        onChange={(value) => {
                          if (value instanceof Date && !isNaN(value)) {
                            onChange('from', value.getTime());
                          }
                        }}
                        value={
                          !!parseInt(query.from)
                            ? new Date(parseInt(query.from))
                            : sub(new Date(), {
                                years: 3,
                              })
                        }
                        maxDate={
                          !!parseInt(query.to)
                            ? new Date(parseInt(query.to))
                            : new Date()
                        }
                        minDate={sub(new Date(), { years: 4 })}
                        name="from"
                        label="Startdatum"
                        inputFormat="dd.MM.yyyy"
                        renderInput={(params) => (
                          <TextField fullWidth {...params} variant="standard" />
                        )}
                      />
                      <Typography
                        variant="overline"
                        display="block"
                        gutterBottom
                      >
                        bis
                      </Typography>
                      <MobileDatePicker
                        disableFuture
                        minDate={
                          !!parseInt(query.from)
                            ? new Date(parseInt(query.from))
                            : sub(new Date(), {
                                years: 2,
                              })
                        }
                        maxDate={new Date()}
                        onChange={(value) => {
                          if (value instanceof Date && !isNaN(value)) {
                            onChange('to', value.getTime());
                          }
                        }}
                        value={
                          !!parseInt(query.to)
                            ? new Date(parseInt(query.to))
                            : new Date()
                        }
                        name="to"
                        label="Enddatum"
                        inputFormat="dd.MM.yyyy"
                        renderInput={(params) => (
                          <TextField fullWidth {...params} variant="standard" />
                        )}
                      />
                    </LocalizationProvider>
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="overline" display="block" gutterBottom>
                    Filtern nach Sensortyp
                  </Typography>

                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          key={query.pax}
                          checked={!!query.pax}
                          name="pax"
                          onChange={(event) =>
                            onChange(event.target.name, event.target.checked)
                          }
                        />
                      }
                      label="PAX-Sensoren"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          key={query.env}
                          checked={query.env}
                          name="env"
                          onChange={(event) =>
                            onChange(event.target.name, event.target.checked)
                          }
                        />
                      }
                      label="Umwelt-Sensoren"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={query.audio}
                          name="audio"
                          onChange={(event) =>
                            onChange(event.target.name, event.target.checked)
                          }
                        />
                      }
                      label="Audio-Sensoren"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={query.optical}
                          name="optical"
                          onChange={(event) =>
                            onChange(event.target.name, event.target.checked)
                          }
                        />
                      }
                      label="Kameras"
                    />
                  </FormGroup>
                </Box>
                <Box>
                  <Typography variant="overline" display="block" gutterBottom>
                    Forschungsareale
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          key={query.fs1}
                          checked={query.fs1}
                          name="fs1"
                          onChange={(event) =>
                            onChange(event.target.name, event.target.checked)
                          }
                        />
                      }
                      label="Merian Gärten (FS1)"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          key={query.fs2}
                          checked={query.fs2}
                          name="fs2"
                          onChange={(event) =>
                            onChange(event.target.name, event.target.checked)
                          }
                        />
                      }
                      label="Dreispitz Areal (FS2)"
                    />
                  </FormGroup>
                </Box>
                <Box>
                  <Typography variant="overline" display="block" gutterBottom>
                    Nach Kategorien filtern
                  </Typography>
                  <Autocomplete
                    multiple
                    variant="outlined"
                    fullWidth
                    options={tags || []}
                    value={
                      tags?.filter((_t) =>
                        query?.tags?.split(';').includes(_t.name)
                      ) || []
                    }
                    onChange={(event, value) =>
                      onChange('tags', value.map((v) => v.name).join(';'))
                    }
                    getOptionLabel={(option) => option.name}
                    renderTags={(values, getTagProps) => {
                      return values.map((option, index) => (
                        <Chip
                          key={index}
                          variant="outlined"
                          label={option.name}
                          {...getTagProps({ index })}
                        />
                      ));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        label="Filtern nach Kategorien"
                        placeholder="Ein oder mehrere Kategorien setzen"
                      />
                    )}
                  />
                </Box>
              </Stack>
            </Box>

            <Box sx={{ paddingX: 3 }}>
              {menuItems
                .filter((menuItem) => !menuItem.hidden)
                .map((menuItem) => (
                  <ListItemButton
                    key={menuItem.text}
                    onClick={() => {
                      if (menuItem.path === 'info') {
                        showInfoModal();
                        setOpen(false);
                      } else {
                        navigate(menuItem.path);
                        setOpen(false);
                      }
                    }}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <i className={menuItem.iconClass} />
                    </ListItemIcon>
                    <ListItemText
                      primary={menuItem.text}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                ))}
            </Box>
          </Stack>
        </List>
      </Drawer>
    </Box>
  );
};

FilterBar.propTypes = {
  tags: PropTypes.array,
  showInfoModal: PropTypes.func,
};

export default FilterBar;
