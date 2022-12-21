// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Marker, Tooltip } from 'react-leaflet';
import { useSelector } from 'react-redux';
import MarkerIcon from './MarkerIcon';
import { getSubscription } from '../../../state/selectors/nodes.selector';

const MarkerComponent = ({
  nodeId,
  active,
  position,
  tooltip,
  type,
  onClick,
  disabled,
}) => {
  const [markerIcon, setMarkerIcon] = useState(MarkerIcon(type, false));
  useEffect(() => {
    setMarkerIcon(MarkerIcon(type, active));
  }, [active]);

  return (
    <Marker
      disabled={disabled}
      position={position}
      icon={markerIcon}
      eventHandlers={{
        click: !disabled && onClick,
      }}
    >
      {tooltip && <Tooltip direction="top">{tooltip}</Tooltip>}
    </Marker>
  );
};

MarkerComponent.defaultProps = {
  tooltip: '',
  type: '',
  onClick: () => {},
  active: false,
};

MarkerComponent.propTypes = {
  nodeId: PropTypes.string.isRequired,
  active: PropTypes.boolean,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  tooltip: PropTypes.string,
  type: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default MarkerComponent;
