// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

export const SET_TIME_START = '[TIME] set start';
export const SET_TIME_END = '[TIME] set end';
export const SET_RANGE_START = '[TIME] set time range start';
export const SET_RANGE_END = '[TIME] set time range end';

export const setTimeStart = (startTime) => ({
  type: SET_TIME_START,
  payload: startTime,
});

export const setTimeEnd = (endTime) => ({
  type: SET_TIME_END,
  payload: endTime,
});

export const setTimeRangeStart = (startTime) => ({
  type: SET_RANGE_START,
  payload: startTime,
});

export const setTimeRangeEnd = (endTime) => ({
  type: SET_RANGE_END,
  payload: endTime,
});
