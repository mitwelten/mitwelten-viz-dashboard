// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useEffect, useState } from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import File from '../components/presenters/File';
import { format } from 'date-fns';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fileIcon, imageIcon } from '../../assets/icons';
import config from '../../assets/application';
import JSZip from 'jszip';
import PropTypes from 'prop-types';
import { entryById } from '../../api/entries';
import { getS3File } from '../../api/entries';
import { copyURLToClipboard } from '../../state/actions/util.actions';
import GalleryPanelContent from '../components/panels/gallery/GalleryPanelContent';
import GalleryPanelHeader from '../components/panels/gallery/GalleryPanelHeader';
import styles from './GalleryPanelContainer.module.scss';
import GalleryPanelAction from '../components/panels/gallery/GalleryPanelActions';
import {
  getAllImageUrls,
  getImageInterval,
} from '../../state/selectors/images.selector';
import { loadImages } from '../../state/actions/images.action';
import logo from '../../assets/images/loading.gif';
import { getEndTime, getStartTime } from '../../state/selectors/time.selector';

const EntriesGalleryContainer = ({
  collapseGallery,
  entry,
  onClose,
  ...props
}) => {
  const [loaded, setLoaded] = useState([]);
  const [imagesToShow, setImagesToShow] = useState([]);
  const [numberOfImagesToShow, setNumberOfImagesToShow] = useState(5);
  useEffect(() => {
    const getEntryInfos = async () => {
      const e = await entryById(entry.id);

      let images = await e.files;
      if (images) {
        images = await Promise.all(
          images.map(async (img) => {
            const res = await getS3File(img.name);
            return { ...img, ...res };
          })
        );
        setImagesToShow(await images);
        setLoaded(await images.map((img) => img.id));
      }
    };
    getEntryInfos();
  }, []);

  const imageInterval = useSelector(getImageInterval);
  const startTime = useSelector(getStartTime);
  const endTime = useSelector(getEndTime);

  const dispatch = useDispatch();

  const exportData = async () => {
    const images = imageUrls.map(
      (url) =>
        new Promise((resolve, reject) =>
          fetch(url)
            .then((response) => response.blob())
            .then(resolve)
            .catch(reject)
        )
    );
    const results = await Promise.all(images);

    const zip = new JSZip();
    results.forEach((img, idx) =>
      zip.file(`${imageUrls[idx].split('/').pop()}`, img, { type: img.type })
    );
    const blob = await zip.generateAsync({ type: 'blob' });

    const a = document.createElement('a');
    a.download = 'images.zip';
    a.href = window.URL.createObjectURL(blob);
    a.dispatchEvent(
      new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
      })
    );
    a.remove();
  };

  const loadMoreImages = () => {
    setNumberOfImagesToShow(
      Math.min(imageUrls.length, numberOfImagesToShow + 5)
    );
  };

  const handleFileAction = (img, index) => {
    if (img.type === 'audio/mpeg') {
      return (
        <audio controls style={{ backgroundColor: 'white', width: '100%' }}>
          <source src={img.url} type="audio/mpeg" />
        </audio>
      );
    } else if (img.type === 'application/pdf') {
      return <File file={img} />;
    } else if (img.type.includes('image')) {
      return (
        <>
          <a href={img.url} target="_blank" rel="noreferrer">
            <img
              src={img.url}
              className={loaded.includes(img.id) ? '' : styles.hidden}
              alt={`Bild`}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'cover',
              }}
            />
          </a>
        </>
      );
    }
  };

  return (
    <div className={styles.panelContainer}>
      <GalleryPanelHeader onIconClick={onClose}>
        <Typography variant="h5" component="h5">
          {entry.name}
        </Typography>
      </GalleryPanelHeader>

      <GalleryPanelContent>
        <Stack spacing={2}>
          <p>{entry.description}</p>
          <div>
            <Typography variant="overline" component="h6" color="black">
              Datum
            </Typography>
            <Typography component="body1">
              {format(new Date(entry.date), 'dd.MM.yyyy')}
            </Typography>
          </div>
          <div>
            {entry.tags?.length && (
              <>
                <Typography variant="overline" color="black" component="h6">
                  Tags
                </Typography>
                <Typography component="body1">
                  {entry.tags?.map((tag) => (
                    <Chip
                      key={tag.id}
                      variant="outlined"
                      label={tag.name}
                      style={{ marginRight: 3 }}
                    />
                  ))}
                </Typography>
              </>
            )}
          </div>

          <div className={styles.panelContent}>
            {imagesToShow?.length > 0 ? (
              <>
                <Typography variant="overline" component="h6" color="black">
                  Downloads
                </Typography>
                {imagesToShow
                  .filter((img, idx) => idx < numberOfImagesToShow)
                  .map((img, index) => (
                    <div
                      key={index}
                      className={styles.sensorDataContainer}
                      style={{ width: '100%' }}
                    >
                      {!loaded.includes(img.id) && (
                        <div>
                          <img src={logo} alt="loading" />
                        </div>
                      )}
                      {handleFileAction(img, index)}
                    </div>
                  ))}
                {numberOfImagesToShow < imagesToShow.length && (
                  <div className={styles.loadMoreContainer}>
                    <p>&nbsp;</p>
                    <button
                      type="button"
                      title="Weitere Bilder laden"
                      onClick={() => loadMoreImages()}
                    >
                      <i className="fas fa-angle-double-right" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div></div>
            )}
          </div>
        </Stack>
      </GalleryPanelContent>
      {/* <GalleryPanelAction
          share={() => dispatch(copyURLToClipboard)}
          exportData={exportData}
        /> */}
    </div>
  );
};

EntriesGalleryContainer.propTypes = {
  collapseGallery: PropTypes.func.isRequired,
  popupState: PropTypes.object,
  entry: PropTypes.object,
  onClose: PropTypes.func,
};

export default EntriesGalleryContainer;
