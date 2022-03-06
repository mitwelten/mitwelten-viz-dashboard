// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

const getAllNodes = (state) => state.nodes.all;
const getDisplayedNodes = (state) => state.nodes.displayed;
const getDisabledNodes = (state) => state.nodes.disabled;
const getSubscription = (state) => state.nodes.subscription;

export { getAllNodes, getDisplayedNodes, getDisabledNodes, getSubscription };
