// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

const getStartTime = (state) => state.time.start;
const getEndTime = (state) => state.time.end;
const getTimeRangeStart = (state) => state.time.rangeStart;
const getTimeRangeEnd = (state) => state.time.rangeEnd;

export { getStartTime, getEndTime, getTimeRangeStart, getTimeRangeEnd };
