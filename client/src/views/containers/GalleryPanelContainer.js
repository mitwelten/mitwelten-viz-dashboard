// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JSZip from 'jszip';
import PropTypes from 'prop-types';
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

const GalleryPanelContainer = ({ collapseGallery }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [loaded, setLoaded] = useState([]);
  const [numberOfImagesToShow, setNumberOfImagesToShow] = useState(5);
  const [imagesToShow, setImagesToShow] = useState([]);

  const imageUrls = useSelector(getAllImageUrls);
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

  const timeStampOfImageUrl = (url) => {
    const imgName = url.match(/(?!\/)IMG.*(?=\.)/g)[0];
    const timeStamp = imgName.match(/(?!_)\d+/g);
    const date = timeStamp[0];
    const time = timeStamp[1];

    const year = date.match(/\d{4}/g)[0];
    const monthAndDay = date.match(/\d{4}/g)[1];
    const month = monthAndDay.match(/\d{2}/g)[0];
    const day = monthAndDay.match(/\d{2}/g)[1];

    const hour = time.match(/\d{2}/g)[0];
    const minutes = time.match(/\d{2}/g)[1];
    const seconds = time.match(/\d{2}/g)[2];

    return new Date(year, +month - 1, day, hour, minutes, seconds);
  };

  const loadMoreImages = () => {
    setNumberOfImagesToShow(
      Math.min(imageUrls.length, numberOfImagesToShow + 5)
    );
  };

  useEffect(() => {
    dispatch(loadImages);
  }, [startTime, endTime]);

  useEffect(() => {
    if (imageUrls?.length > 0) {
      if (imageInterval > 0) {
        const timestampsOfImages = imageUrls.map((url) =>
          timeStampOfImageUrl(url).getTime()
        );
        const startImageTime = timestampsOfImages[0];
        const timestampsInInterval = timestampsOfImages.filter(
          (timestamp) =>
            (timestamp - startImageTime) % imageInterval === 0 ||
            startImageTime === timestamp
        );
        const urls = imageUrls.filter((url) =>
          timestampsInInterval.includes(timeStampOfImageUrl(url).getTime())
        );
        setImagesToShow(urls);
      } else {
        setImagesToShow(imageUrls);
      }
    }
  }, [imageUrls, imageInterval]);

  return (
    <>
      <div
        className={`${styles.container} ${
          collapsed ? styles.containerCollapsed : ''
        }`}
      >
        <GalleryPanelHeader
          collapsed={collapsed}
          onIconClick={() => {
            setCollapsed(true);
            collapseGallery();
          }}
        >
          Node ID
        </GalleryPanelHeader>
        <GalleryPanelContent>
          <div className={styles.panelContent}>
            {imagesToShow?.length > 0 ? (
              <>
                {imagesToShow
                  .filter((url, idx) => idx < numberOfImagesToShow)
                  .map((imageUrl) => (
                    <div key={imageUrl} className={styles.sensorDataContainer}>
                      <p>{timeStampOfImageUrl(imageUrl).toLocaleString()}</p>
                      <a href={imageUrl} target="_blank" rel="noreferrer">
                        {}
                        {!loaded.includes(imageUrl) && (
                          <div>
                            <img src={logo} alt="loading" />
                          </div>
                        )}
                        <img
                          src={imageUrl}
                          className={
                            loaded.includes(imageUrl) ? '' : styles.hidden
                          }
                          alt={`Bild vom ${timeStampOfImageUrl(
                            imageUrl
                          ).toLocaleString()}`}
                          onLoad={() => setLoaded([...loaded, imageUrl])}
                        />
                      </a>
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
              <div>Es sind keine Bilder im gewählten Zeitraum vorhanden</div>
            )}
          </div>
        </GalleryPanelContent>
        <GalleryPanelAction
          share={() => dispatch(copyURLToClipboard)}
          exportData={exportData}
        />
      </div>
    </>
  );
};

GalleryPanelContainer.propTypes = {
  collapseGallery: PropTypes.func.isRequired,
};

export default GalleryPanelContainer;
