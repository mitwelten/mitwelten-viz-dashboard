// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Marker, Tooltip } from 'react-leaflet';
import { useSelector } from 'react-redux';
import MarkerIcon from './MarkerIcon';
import { getSubscription } from '../../../state/selectors/nodes.selector';

const MarkerComponent = ({ nodeId, position, tooltip, type, clickHandler }) => {
  const [hovering, setHovering] = useState(false);
  const subscription = useSelector(getSubscription);

  return (
    <Marker
      position={position}
      icon={MarkerIcon(type, hovering, nodeId === subscription)}
      eventHandlers={{
        click: clickHandler,
        mouseover: () => setHovering(true),
        mouseout: () => setHovering(false),
      }}
    >
      {tooltip && <Tooltip direction="top">{tooltip}</Tooltip>}
    </Marker>
  );
};

MarkerComponent.defaultProps = {
  tooltip: '',
  type: '',
  clickHandler: () => {},
};

MarkerComponent.propTypes = {
  nodeId: PropTypes.string.isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  tooltip: PropTypes.string,
  type: PropTypes.string,
  clickHandler: PropTypes.func,
};

export default MarkerComponent;
