// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  LayersControl,
  MapContainer,
  TileLayer,
  ZoomControl,
} from 'react-leaflet';

const MapComponent = ({ children, width, height, zoom, center }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const maxZoomLevel = 19.9;

  const onScreenResize = (event) => {
    setScreenWidth(event.target.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', onScreenResize);

    return () => {
      window.removeEventListener('resize', onScreenResize);
    };
  }, []);

  return (
    <>
      <MapContainer
        center={center}
        zoom={zoom || 16}
        style={{
          width: width || '100vw',
          height: height || '100vh',
          margin: 0,
          padding: 0,
        }}
        zoomControl={false}
        maxZoom={maxZoomLevel}
      >
        <LayersControl position={'bottomleft'}>
          <LayersControl.BaseLayer name="Stadia Maps">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">Stadia Maps</a> contributors'
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
              maxZoom={maxZoomLevel}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="SwissTopo">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">SwissTopo</a> contributors'
              url="https://wmts10.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg"
              maxZoom={maxZoomLevel}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="SwissTopo 2">
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">SwissTopo</a> contributors'
              url="https://wmts20.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg"
              maxZoom={maxZoomLevel}
            />
          </LayersControl.BaseLayer>

          <LayersControl.BaseLayer checked name="OpenStreetMap.Mapnik">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={maxZoomLevel}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenStreetMap.BlackAndWhite">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png"
              maxZoom={maxZoomLevel}
            />
          </LayersControl.BaseLayer>
          {children}
        </LayersControl>
        <ZoomControl position="bottomright" />
      </MapContainer>
    </>
  );
};

MapComponent.propTypes = {
  children: PropTypes.node.isRequired,
  height: PropTypes.string,
  width: PropTypes.string,
  zoom: PropTypes.number,
  center: PropTypes.array,
};

export default MapComponent;
