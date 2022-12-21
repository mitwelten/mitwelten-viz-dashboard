// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import { getCenter } from 'leaflet';
import nodesService from '../../services/nodes.service';
import { sub } from 'date-fns';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import FilterBar from '../components/FilterBar';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import { useDispatch, useSelector } from 'react-redux';
import { LayerGroup, LayersControl, Polyline } from 'react-leaflet';
import {
  getDisabledNodes,
  getDisplayedNodes,
} from '../../state/selectors/nodes.selector';
import MapComponent from '../components/map/MapComponent';
import MarkerComponent from '../components/map/MarkerComponent';
import locations from '../../assets/locations.json';
import imageLocations from '../../assets/image_locations.json';
import polygonMerian from '../../assets/polygon_merian.json';
import polygonDreispitz from '../../assets/polygon_dreispitz.json';
import InfoPanelContainer from './InfoPanelContainer';
import TimeAxis from '../components/TimeAxis';
import { allEntries } from '../../api/entries';
import { tags as tagsQuery } from '../../api/tags';
import DataPanelContainer from './DataPanelContainer';
import GalleryPanelContainer from './GalleryPanelContainer';
import EntriesGalleryContainer from './EntriesGalleryContainer';
import { node } from 'prop-types';

const MapContainer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams, setSearchParams] = useSearchParams();
  const [entries, setEntries] = useState([]);
  const [displayedNodes, setDisplayedNodes] = useState([]);
  const [nodesInTimeRange, setNodesInTimeRange] = useState([]);
  const [tags, setTags] = useState([]);
  const query = Object.fromEntries([...searchParams]);
  const [anchorNode, setAnchorNode] = React.useState(null);
  const [anchorEntry, setAnchorEntry] = React.useState(null);

  const [openEntry, setOpenEntry] = React.useState(null);
  const [openNode, setOpenNode] = React.useState(null);

  const nodeId = openNode ? 'node-popper' : undefined;

  const handleEntryMarkerClick = (event, entry) => {
    if (event) {
      setAnchorEntry(event?.target?._icon);
      setOpenEntry(entry);
    } else {
      setAnchorEntry(undefined);
      setOpenEntry(null);
    }
  };

  const fetchNodesInTimeRange = (dateFrom, dateTo) => {
    nodesService
      .getInTimeRange(dateFrom, dateTo)
      .then((res) => setNodesInTimeRange(res));
  };

  useEffect(() => {
    const dateFrom = !!parseInt(query.from)
      ? new Date(parseInt(query.from))
      : sub(new Date(), {
          years: 1,
        });
    const dateTo = !!parseInt(query.to)
      ? new Date(parseInt(query.to))
      : new Date();
    fetchNodesInTimeRange(dateFrom, dateTo);
  }, [query.from, query.to]);

  useEffect(() => {
    {
      let filteredNodes = [];
      if (query.pax) {
        filteredNodes = [
          ...filteredNodes,
          ...nodesInTimeRange.filter(
            (node) => node.type.toLowerCase() === 'pax'
          ),
        ];
      }
      if (query.env) {
        filteredNodes = [
          ...filteredNodes,
          ...nodesInTimeRange.filter(
            (node) => node.type.toLowerCase() === 'humitempmoisture'
          ),
        ];
      }
      if (query.audio) {
        filteredNodes = [
          ...filteredNodes,
          ...nodesInTimeRange.filter(
            (node) => node.type.toLowerCase() === 'audio'
          ),
        ];
      }
      if (query.optical) {
        filteredNodes = [
          ...filteredNodes,
          ...nodesInTimeRange.filter(
            (node) => node.type.toLowerCase() === 'optical'
          ),
        ];
      }
      if (query.tags) {
        filteredNodes = [
          ...filteredNodes,
          ...nodesInTimeRange.filter((node) =>
            node?.tags?.some((tag) => query.tags.split(';')?.includes(tag.name))
          ),
        ];
      }

      setDisplayedNodes(filteredNodes);
    }
  }, [
    query.pax,
    query.env,
    query.tags,
    query.audio,
    query.optical,
    nodesInTimeRange,
  ]);

  const handleNodeMarkerClick = (event, node) => {
    console.log('node', node);
    if (event) {
      setAnchorNode(event?.target?._icon);
      setOpenNode(node);
    }
    if (event === undefined) {
      setAnchorNode(null);
      setOpenNode(null);
    }
    if (!nodesToCompare.some((n) => n.node_id === node.node_id)) {
      setComparingNodes([
        ...nodesToCompare.filter((n) => n.type === node.type),
        node,
      ]);
    } else if (
      !nodesToCompare.filter((n) => n.node_id !== node.node_id).length
    ) {
      setComparingNodes([]);
      setAnchorNode(null);
      setOpenNode(null);
    } else {
      setComparingNodes(
        nodesToCompare.filter((n) => n.node_id !== node.node_id)
      );
    }
  };

  const [showGallery, setShowGallery] = useState(false);
  const [entryGallery, setEntryGallery] = useState(false);
  const [nodesToCompare, setComparingNodes] = useState([]);

  const getCoordinatesOfLocationId = (node) => {
    const location = node.location;
    return location ? [location.latitude, location.longitude] : [];
  };

  const fetchAllEntries = async () => {
    try {
      let res = await allEntries();
      if (query.tags) {
        res = res.filter((entry) =>
          entry?.tags?.some((tag) => query.tags.split(';').includes(tag.name))
        );
      }
      console.log('filteredEntries', res);
      setEntries(res);
    } catch (err) {
      console.log('err', err);
    }
  };
  useEffect(() => {
    fetchAllEntries();
  }, [query.tags]);

  const fetchAllTags = async () => {
    try {
      let res = await tagsQuery();
      setTags(res);
    } catch (err) {
      console.log('err', err);
    }
  };

  useEffect(() => {
    fetchAllTags();
  }, []);

  function renderSensorMarker(node) {
    return (
      <>
        <MarkerComponent
          disabled={!['HumiTempMoisture', 'pax'].includes(node.type)}
          key={node.node_id}
          nodeId={node.node_id}
          active={nodesToCompare.some((n) => n.node_id === node.node_id)}
          position={getCoordinatesOfLocationId(node)}
          tooltip={handleMarkerTooltip(node.type, node.node_id)}
          type={node.type}
          onClick={(e) => handleNodeMarkerClick(e, node)}
        />
        <Popper
          id={nodeId}
          // anchorEl={anchorNode}
          open={node.node_id === openNode?.node_id}
          sx={{
            maxWidth: 500,
            zIndex: 999,
            marginTop: isMobile ? 15 : 1,
            marginLeft: 1,
          }}
          modifiers={{
            offset: {
              enabled: true,
              offset: '30, 30',
            },
          }}
        >
          <Paper>
            <DataPanelContainer
              onClose={() => {
                setComparingNodes([]);
                setAnchorNode();
                setOpenNode();
              }}
              node={node}
              nodesToCompare={nodesToCompare}
            />
          </Paper>
        </Popper>
      </>
    );
  }

  function handleMarkerTooltip(type, nodeId) {
    if (type === 'pax') {
      return `${nodeId}: Besucherfrequenz Sensor`;
    } else if (type.toLowerCase() === 'humitempmoisture') {
      return `${nodeId}: Umweltsensor`;
    } else if (type.toLowerCase() === 'audio') {
      return `${nodeId}: Audiosensor (coming soon)`;
    } else if (type.toLowerCase() === 'optical') {
      return `${nodeId}: Blüten Kamera (coming soon)`;
    }
  }

  return (
    <>
      <div>
        <FilterBar tags={tags} showInfoModal={() => setShowGallery(true)} />
      </div>
      {showGallery && (
        <InfoPanelContainer
          collapseGallery={() => setShowGallery(false)}
          open={showGallery}
        />
      )}

      <MapComponent
        center={!!query.fs2 ? [47.534116, 7.607177] : [47.535493, 7.613983]}
        zoom={!!query.fs2 ? 15 : 16}
      >
        {!!tags.length &&
          tags.map(
            (tag, index) =>
              entries &&
              entries
                .filter(
                  (entry) =>
                    entry.tags?.map((tag) => tag.name).indexOf(tag.name) !== -1
                )
                .map((entry) => (
                  <>
                    <MarkerComponent
                      id={entry.id}
                      nodeId={`${entry.id}`}
                      position={[entry.location.lat, entry.location.lon]}
                      tooltip={entry.name}
                      type="entry"
                      onClick={(e) => handleEntryMarkerClick(e, entry)}
                    />
                    <Popper
                      id={entry.id}
                      open={entry.id === openEntry?.id}
                      // anchorEl={anchorEntry}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                      sx={{
                        maxWidth: 500,
                        zIndex: 999,
                        marginTop: isMobile ? 15 : 1,
                        marginLeft: 1,
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                      }}
                    >
                      <Paper>
                        <EntriesGalleryContainer
                          entry={entry}
                          onClose={() => {
                            handleEntryMarkerClick();
                          }}
                        />
                      </Paper>
                    </Popper>
                  </>
                ))
          )}
        {displayedNodes.map((node) => renderSensorMarker(node))}

        {query.fs1 && (
          <Polyline
            pathOptions={{ fillColor: 'blue' }}
            positions={polygonMerian}
          />
        )}
        {query.fs2 && (
          <Polyline
            pathOptions={{ fillColor: 'blue' }}
            positions={polygonDreispitz}
          />
        )}
      </MapComponent>
    </>
  );
};

export default MapContainer;
