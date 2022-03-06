// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import { Icon } from 'leaflet';
import marker from '../../../assets/images/marker.svg';
import hoveringMarker from '../../../assets/images/marker_hover.svg';
import disabledMarker from '../../../assets/images/marker_disabled.svg';
import hoveringDisabledMarker from '../../../assets/images/marker_disabled_hover.svg';
import selectedMarker from '../../../assets/images/marker_selected.svg';
import selectedHoveringMarker from '../../../assets/images/marker_selected_hover.svg';
import cameraMarker from '../../../assets/images/camera_marker.svg';
import hoveringCameraMarker from '../../../assets/images/camera_marker_hover.svg';

const DEFAULT_SHADOW_URL = '';
const DEFAULT_SETTING = {
  iconAnchor: [50, 50],
  shadowUrl: DEFAULT_SHADOW_URL,
  shadowAnchor: [0, 0],
  tooltipAnchor: [0, 0],
};

const MarkerIcon = (type = '', hovering = false, subscribed = false) => {
  const getIconProps = () => {
    switch (type) {
      case 'image':
        return {
          ...DEFAULT_SETTING,
          iconUrl: hovering ? hoveringCameraMarker : cameraMarker,
          iconRetinaUrl: hovering ? hoveringCameraMarker : cameraMarker,
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
        if (subscribed) {
          return {
            // ...Icon.Default.prototype.options,
            ...DEFAULT_SETTING,
            iconUrl: hovering ? selectedHoveringMarker : selectedMarker,
            iconRetinaUrl: hovering ? selectedHoveringMarker : selectedMarker,
            shadowUrl: '',
          };
        }
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
