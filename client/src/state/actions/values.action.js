// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

export const LOAD_VALUES = '[VALUES] load values';
export const LOAD_VALUES_SUCCESS = '[VALUES] load values success';
export const FILTER_VALUES_FROM = '[VALUES] filter values from';
export const FILTER_VALUES_TO = '[VALUES] filter values to';

export const loadValues = { type: LOAD_VALUES };

export const loadValuesSuccess = (values) => ({
  type: LOAD_VALUES_SUCCESS,
  payload: values,
});

export const filterValuesFrom = (filter) => ({
  type: FILTER_VALUES_FROM,
  payload: filter,
});

export const filterValuesTo = (filter) => ({
  type: FILTER_VALUES_TO,
  payload: filter,
});
