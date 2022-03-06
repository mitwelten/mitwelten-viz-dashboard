// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LayerGroup, LayersControl, Polyline } from 'react-leaflet';
import { useSearchParams } from 'react-router-dom';
import { subscribeNode } from '../../state/actions/nodes.action';
import {
  getDisabledNodes,
  getDisplayedNodes,
} from '../../state/selectors/nodes.selector';
import MapComponent from '../components/map/MapComponent';
import MarkerComponent from '../components/map/MarkerComponent';
import locations from '../../assets/locations.json';
import imageLocations from '../../assets/image_locations.json';
import polygon from '../../assets/polygon.json';
import InfoPanelContainer from './InfoPanelContainer';
import TimeAxis from '../components/TimeAxis';
import DataPanelContainer from './DataPanelContainer';
import GalleryPanelContainer from './GalleryPanelContainer';

const MapContainer = () => {
  const dispatch = useDispatch();

  const [queryParams] = useSearchParams();

  const disabledNodes = useSelector(getDisabledNodes);
  const displayedNodes = useSelector(getDisplayedNodes);

  const [showGallery, setShowGallery] = useState(false);

  const getCoordinatesOfLocationId = (locationId) => {
    const location = locations.find((loc) => loc.location_id === locationId);
    return location ? [location.latitude, location.longitude] : [];
  };

  const subscribeToChanges = (nodeId) => {
    dispatch(subscribeNode(nodeId));
  };

  useEffect(() => {
    const nodeId = queryParams.get('node');
    if (
      nodeId &&
      [...disabledNodes, ...displayedNodes].some(
        (node) => node.node_id === nodeId
      )
    ) {
      subscribeToChanges(nodeId);
    }
  }, [disabledNodes, displayedNodes, queryParams]);

  return (
    <>
      <InfoPanelContainer />
      <DataPanelContainer />
      {showGallery && (
        <GalleryPanelContainer collapseGallery={() => setShowGallery(false)} />
      )}
      <MapComponent>
        <LayersControl.Overlay checked name="Aktive Sensoren">
          <LayerGroup>
            {displayedNodes &&
              displayedNodes.map((node) => (
                <MarkerComponent
                  key={node.node_id}
                  nodeId={node.node_id}
                  position={getCoordinatesOfLocationId(node.location_id)}
                  tooltip={node.node_id}
                  type={node.type}
                  clickHandler={() => subscribeToChanges(node.node_id)}
                />
              ))}
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay name="Deaktivierte Sensoren">
          <LayerGroup>
            {disabledNodes &&
              disabledNodes.map((node) => (
                <MarkerComponent
                  key={node.node_id}
                  nodeId={node.node_id}
                  position={getCoordinatesOfLocationId(node.location_id)}
                  tooltip={node.node_id}
                  type="disabled"
                  clickHandler={() => subscribeToChanges(node.node_id)}
                />
              ))}
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Bilder">
          <LayerGroup>
            {imageLocations &&
              imageLocations.map((node) => (
                <MarkerComponent
                  key={node.location_id}
                  nodeId={`${node.location_id}`}
                  position={[node.latitude, node.longitude]}
                  tooltip="Bilder"
                  type="image"
                  clickHandler={() => setShowGallery(!showGallery)}
                />
              ))}
          </LayerGroup>
        </LayersControl.Overlay>
        <LayersControl.Overlay checked name="Merian Garten Rahmen">
          <LayerGroup>
            <Polyline pathOptions={{ fillColor: 'blue' }} positions={polygon} />
          </LayerGroup>
        </LayersControl.Overlay>
      </MapComponent>
      <TimeAxis />
    </>
  );
};

export default MapContainer;
