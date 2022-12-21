// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { Icon } from 'leaflet';

import React from 'react';
import marker from '../../../assets/images/marker.svg';
import hoveringMarker from '../../../assets/images/marker_hover.svg';

import paxMarker from '../../../assets/images/pax.svg';
import hoveringPaxMarker from '../../../assets/images/pax_hover.svg';
import entryMarker from '../../../assets/images/entry.svg';
import opticalMarker from '../../../assets/images/optical.svg';
import audioMarker from '../../../assets/images/audio.svg';
import hoveringEntryMarker from '../../../assets/images/entry_hover.svg';
import disabledMarker from '../../../assets/images/marker_disabled.svg';
import hoveringDisabledMarker from '../../../assets/images/marker_disabled_hover.svg';
import selectedMarker from '../../../assets/images/marker_selected.svg';
import selectedHoveringMarker from '../../../assets/images/marker_selected_hover.svg';
import cameraMarker from '../../../assets/images/camera_marker.svg';
import locationMarker from '../../../assets/images/location.svg';
import hoveringCameraMarker from '../../../assets/images/camera_marker_hover.svg';

const DEFAULT_SHADOW_URL = '';
const DEFAULT_SETTING = {
  iconAnchor: [50, 50],
  shadowUrl: DEFAULT_SHADOW_URL,
  shadowAnchor: [0, 0],
  tooltipAnchor: [-17.5, -35],
  iconSize: new L.Point(65, 65),
};

const MarkerIcon = (type = '', hovering = false) => {
  const getIconProps = () => {
    switch (type.toLowerCase()) {
      case 'image':
        return {
          ...DEFAULT_SETTING,
          iconUrl: hovering ? hoveringCameraMarker : cameraMarker,
          iconRetinaUrl: hovering ? hoveringCameraMarker : cameraMarker,
          shadowUrl: '',
        };
      case 'entry':
        return {
          ...DEFAULT_SETTING,
          iconUrl: hovering ? hoveringEntryMarker : entryMarker,
          iconRetinaUrl: hovering ? hoveringEntryMarker : entryMarker,
          shadowUrl: '',
        };

      case 'audio' || 'audiomoth':
        return {
          ...DEFAULT_SETTING,
          iconUrl: audioMarker,
          iconRetinaUrl: audioMarker,
          shadowUrl: '',
        };

      case 'optical':
        return {
          ...DEFAULT_SETTING,
          iconUrl: opticalMarker,
          iconRetinaUrl: opticalMarker,
          shadowUrl: '',
        };

      case 'pax':
        return {
          ...DEFAULT_SETTING,
          iconUrl: hovering ? hoveringPaxMarker : paxMarker,
          iconRetinaUrl: hovering ? hoveringPaxMarker : paxMarker,
          shadowUrl: '',
        };

      case 'disabled':
        return {
          ...DEFAULT_SETTING,
          iconUrl: hovering ? hoveringDisabledMarker : disabledMarker,
          iconRetinaUrl: hovering ? hoveringDisabledMarker : disabledMarker,
          shadowUrl: '',
        };

      default:
        // default settings of leaflet

        return {
          // ...Icon.Default.prototype.options,
          ...DEFAULT_SETTING,
          iconUrl: hovering ? hoveringMarker : marker,
          iconRetinaUrl: hovering ? hoveringMarker : marker,
          shadowUrl: '',
        };
    }
  };

  return new Icon(getIconProps());
};

export default MarkerIcon;
