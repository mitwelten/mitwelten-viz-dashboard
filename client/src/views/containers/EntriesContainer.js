import React, { useEffect, useState, useCallback } from 'react';
import { useTheme } from '@mui/material/styles';
import { format, parseISO } from 'date-fns';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router';
import useMediaQuery from '@mui/material/useMediaQuery';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { useDropzone } from 'react-dropzone';
import { entryById } from '../../api/entries';
import CloseIcon from '@mui/icons-material/Close';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import MarkerComponent from '../components/map/MarkerComponent';
import Box from '@mui/material/Box';
import MapComponent from '../components/map/MapComponent';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import List from '@mui/material/List';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import config from '../../assets/application';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import File from '../components/presenters/File';
import { allEntries } from '../../api/entries';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useForm, Controller } from 'react-hook-form';
import { IconButton, Typography } from '@mui/material';

function getStyles(tags = [], tag, theme) {
  return {
    fontWeight:
      tags.map((t) => t.id).indexOf(tag.id) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const EntriesContainer = ({}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
    getValues,
    setError: setFormError,
  } = useForm({ defaultValues });

  const defaultValues = {
    name: '',
    description: '',
  };
  const [entries, setEntries] = useState([]);
  const [drawer, setDrawer] = React.useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);

  const [documents, setDocuments] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTags, setActiveTags] = useState([]);

  useEffect(async () => {
    await fetchAllEntries();
    await fetchAllTags();
  }, []);

  const onDrop = async (acceptedFiles) => {
    const convertedFiles = Promise.all(
      acceptedFiles.map(async (file) => {
        return {
          file: await convertToBase64(file),
          type: file.type,
          name: file.name,
        };
      })
    );

    setDocuments(await convertedFiles);
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
  });
  const fetchAllEntries = async () => {
    try {
      let res = await allEntries();
      setEntries(res);
    } catch (err) {
      console.log('err', err);
    }
  };

  const fetchAllTags = async () => {
    try {
      let res = await fetch(`${config.url}/tags`);
      res = await res.json();
      setTags(res);
    } catch (err) {
      console.log('err', err);
    }
  };

  const createNewEntry = async (data) => {
    setLoading(true);
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          tags: activeTags.map((t) => ({
            id: tags.find((tag) => tag.name === t)?.id,
            name: t,
          })),
          files: documents,
        }),
      };

      let res = await fetch(`${config.url}/entries/create`, requestOptions);
      res = await res.json();
    } catch (err) {
      console.log('err', err);
    } finally {
      fetchAllTags();
      fetchAllEntries();
      handleClose();
      setLoading(false);
    }
  };

  const updateEntry = async (data) => {
    setLoading(true);
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          tags: activeTags.map((t) => ({
            id: tags.find((tag) => tag.name === t)?.id,
            name: t,
          })),
          files: documents,
        }),
      };

      let res = await fetch(`${config.url}/entries/update`, requestOptions);
      res = await res.json();
    } catch (err) {
      console.log('err', err);
    } finally {
      fetchAllTags();
      fetchAllEntries();
      handleClose();
      setLoading(false);
    }
  };

  const deleteEntry = async (data) => {
    setLoading(true);
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
        }),
      };

      let res = await fetch(`${config.url}/entries/delete`, requestOptions);
      res = await res.json();
    } catch (err) {
      console.log('err', err);
    } finally {
      fetchAllTags();
      fetchAllEntries();
      handleClose();
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset(defaultValues);
    setDialogOpen(false);
    setDocuments([]);
    setActiveTags([]);
  };

  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const onSubmit = (data) => {
    data.id ? updateEntry(data) : createNewEntry(data);
  };

  const handleDrawer = async (entry) => {
    const e = await entryById(entry.id);
    setDrawer(e);
  };

  const { onChange, onBlur, name, ref } = register('date');

  const listDrawer = () => {
    return (
      !!drawer && (
        <Box sx={{ padding: 3, maxWidth: 650 }}>
          <Stack spacing={2}>
            <Stack
              spacing={2}
              direction="row"
              justifyContent="space-between"
              alignContent="center"
              alignItems="center"
            >
              <Typography variant="h4" component="h1" gutterBottom>
                {drawer.name}
              </Typography>
              <label>
                <IconButton
                  onClick={() => setDrawer(false)}
                  color="secondary"
                  aria-label="upload picture"
                >
                  <CloseIcon />
                </IconButton>
              </label>
            </Stack>
            <div>
              <Typography component="h6" variant="h6" color="black">
                Beschreibung
              </Typography>
              <Typography component="body1">{drawer.description}</Typography>
            </div>
            <div>
              <Typography component="h6" variant="h6" color="black">
                Datum
              </Typography>
              <Typography component="body1">
                {format(new Date(drawer.date), 'dd.MM.yyyy')}
              </Typography>
            </div>
            <div>
              <Typography
                component="h6"
                variant="h6"
                color="black"
                gutterBottom
              >
                Kategorien
              </Typography>
              {drawer.tags?.length ? (
                <Typography component="body1">
                  {drawer.tags?.map((tag) => (
                    <Chip
                      key={tag.id}
                      variant="outlined"
                      label={tag.name}
                      style={{ marginRight: 3 }}
                    />
                  ))}
                </Typography>
              ) : (
                '(keine Tags vorhanden)'
              )}
            </div>
            <div>
              <Typography
                component="h6"
                variant="h6"
                color="black"
                gutterBottom
              >
                Dateien
              </Typography>
              <Stack spacing={1}>
                {drawer.files?.length
                  ? drawer?.files?.map((file) => (
                      <File file={file} key={file.id} />
                    ))
                  : '(keine Dateien vorhanden)'}
              </Stack>
            </div>
            <div>
              <Typography component="h6" variant="h6" color="black">
                Position
              </Typography>
              {drawer.location && (
                <>
                  <MapComponent
                    width="100%"
                    height="290px"
                    zoom={19}
                    center={[drawer.location.lat, drawer.location.lon]}
                  >
                    <MarkerComponent
                      id={drawer.id}
                      nodeId={`${drawer.id}`}
                      position={[drawer.location.lat, drawer.location.lon]}
                      tooltip={drawer.name}
                      type="entry"
                      disabled
                    />
                  </MapComponent>
                  <Typography component="body1">
                    lat: {drawer.location.lat}, lng: {drawer.location.lon}
                  </Typography>
                </>
              )}
            </div>
            <Stack
              direction={isMobile ? 'column' : 'row'}
              spacing={2}
              justifyContent="center"
            >
              <Button
                sx={{ width: isMobile ? '100%' : 200, alignSelf: 'center' }}
                onClick={() => {
                  setDrawer(false);
                  reset(drawer);
                  !!drawer?.files?.length
                    ? setDocuments(drawer.files)
                    : setDocuments([]);
                  !!drawer?.tags?.length
                    ? setActiveTags(drawer.tags.map((t) => t.name))
                    : setActiveTags([]);
                  setDialogOpen(true);
                }}
                variant="contained"
                color="primary"
              >
                Bearbeiten
              </Button>
              <Button
                sx={{ width: isMobile ? '100%' : 200, alignSelf: 'center' }}
                onClick={() => {
                  deleteEntry(drawer);
                  setDrawer(false);
                }}
                variant="contained"
                color="error"
              >
                Löschen
              </Button>
            </Stack>
          </Stack>
        </Box>
      )
    );
  };

  return (
    <Box
      sx={{
        padding: 5,
        width: { xs: '100%', md: '80%' },
        margin: '40px auto 0 auto',
        bgcolor: 'background.paper',
      }}
    >
      <Fab
        aria-label="open"
        onClick={() => navigate('/')}
        color="primary"
        sx={{
          position: 'fixed',
          right: 20,
          top: 20,
        }}
      >
        <ArrowForwardOutlinedIcon />
      </Fab>
      <h2>Karten-Einträge verwalten</h2>
      <nav aria-label="">
        <List>
          {entries.map((entry, index) => {
            return (
              <>
                <ListItem
                  key={index}
                  onClick={() => handleDrawer(entry)}
                  disablePadding
                  sx={{ border: '1px solid rgba(0, 0, 0, 0.12)', marginTop: 1 }}
                >
                  <ListItemButton component="">
                    <ListItemText primary={`${entry.name}`} />
                    {!isMobile &&
                      entry?.tags?.map((tag) => (
                        <Chip
                          key={tag.id}
                          variant="outlined"
                          label={tag.name}
                          style={{ marginRight: 3 }}
                        />
                      ))}
                  </ListItemButton>
                </ListItem>
                <Drawer
                  anchor="right"
                  open={entry.id === drawer.id}
                  onClose={() => setDrawer(false)}
                  sx={{ paper: { maxWidth: '100%' } }}
                >
                  {listDrawer(entry)}
                </Drawer>
              </>
            );
          })}
        </List>
      </nav>
      <Fab
        aria-label="add"
        onClick={() => {
          setDialogOpen(true);
        }}
        color="secondary"
        sx={{
          position: 'fixed',
          bottom: 40,
          right: 40,
        }}
      >
        <AddIcon />
      </Fab>
      <Dialog fullScreen onClose={handleClose} open={dialogOpen}>
        <Box sx={{ maxWidth: 650, margin: '0 auto' }}>
          <DialogTitle>Eintrag verwalten</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
              <Box
                component="form"
                sx={{
                  '& > :not(style)': { m: 1 },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  {...register('name', {
                    required: 'Angabe erforderlich',
                  })}
                  required
                  label="Titel"
                  error={!!errors.name}
                  helperText={errors.email?.message}
                  disabled={loading}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  {...register('description')}
                  disabled={loading}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  label="Beschreibung"
                  variant="outlined"
                  aria-multiline
                  multiline
                  fullWidth
                  rows={4}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Controller
                    control={control}
                    name="date"
                    render={({
                      field: { onChange, onBlur, value, name, ref },
                      fieldState: { invalid, isTouched, isDirty, error },
                      formState,
                    }) => (
                      <>
                        <MobileDatePicker
                          onBlur={onBlur} // notify when input is touched
                          onChange={(value) => {
                            onChange(new Date(value).toISOString());
                          }}
                          value={value}
                          inputRef={ref}
                          label="Datum des Eintrages"
                          inputFormat="dd.MM.yyyy"
                          renderInput={(params) => (
                            <TextField fullWidth {...params} />
                          )}
                        />
                      </>
                    )}
                  />
                </LocalizationProvider>
                <TextField
                  {...register('location.lat', {
                    required: 'Angabe erforderlich',
                    pattern:
                      /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/,
                    message: 'Ungültige Koordinaten',
                  })}
                  label="Postion: Latitude"
                  disabled={loading}
                  error={!!errors?.location?.lat}
                  helperText={errors?.location?.lat?.message}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  {...register('location.lon', {
                    required: 'Angabe erforderlich',
                    pattern:
                      /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/,
                    message: 'Ungültige Koordinaten',
                  })}
                  error={!!errors?.location?.lon}
                  helperText={errors?.location?.lon?.message}
                  label="Position: Longitude"
                  variant="outlined"
                  disabled={loading}
                  fullWidth
                />

                <Autocomplete
                  multiple
                  variant="outlined"
                  disabled={loading}
                  fullWidth
                  options={tags.map((option, index) => option.name)}
                  defaultValue={activeTags}
                  freeSolo
                  onChange={(event, value) =>
                    !value.length && setActiveTags([])
                  }
                  renderTags={(value, getTagProps) => {
                    setActiveTags(value);
                    return value.map((option, index) => (
                      <Chip
                        key={index}
                        variant="outlined"
                        label={option}
                        {...getTagProps({ index })}
                      />
                    ));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      disabled={loading}
                      variant="outlined"
                      label="Tags"
                      placeholder="Ein oder mehrere Tags setzen"
                    />
                  )}
                />

                <Box
                  {...getRootProps({ className: 'dropzone' })}
                  sx={{
                    minHeight: 250,
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    borderRadius: 1,
                    backgroundColor: loading && 'rgba(234, 234, 234, 0.1)',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <input {...getInputProps()} disabled={loading} />
                  <div style={{ width: '80%' }}>
                    {!!documents.length
                      ? documents.map((i, index) => (
                          <Stack
                            direction={'row'}
                            key={index}
                            alignItems="center"
                            spacing={2}
                          >
                            <p
                              style={{
                                color: loading && 'rgb(234, 234, 234)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {i.name}
                            </p>
                            <div>
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDocuments(
                                    documents.filter(
                                      (document) => document.name !== i.name
                                    )
                                  );
                                }}
                                variant="contained"
                                size="small"
                                color="secondary"
                                aria-label="delete file"
                              >
                                <ClearIcon />
                              </IconButton>
                            </div>
                          </Stack>
                        ))
                      : 'Drag and drop images files here, or click to select images'}
                  </div>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button disabled={loading} onClick={handleClose}>
                Abbrechen
              </Button>
              <Button disabled={loading || errors.length} type="submit">
                Speichern
              </Button>
            </DialogActions>
          </form>
        </Box>
      </Dialog>
    </Box>
  );
};
export default EntriesContainer;
