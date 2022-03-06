// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import makePaxSensorData from './paxSensorData';

let paxData;

beforeEach(() => {
  paxData = {
    node_id: '1111-2222',
    voltage: 10,
    pax: 0,
    time: new Date(new Date().getTime() - 1000).toISOString(),
  };
});

describe('Test with valid input', () => {
  test('should create pax data with valid input', () => {
    const paxSensorData = makePaxSensorData(paxData);

    expect(paxSensorData).toBeDefined();
    expect(paxSensorData).toEqual({ ...paxData, voltageUnit: 'V', paxUnit: '' });
  });

  test('should prevent from modifying created data', () => {
    let paxSensorData = makePaxSensorData(paxData);

    expect(() => {
      paxSensorData.voltage = 100;
    }).toThrow();
  });
});

describe('Test without any data', () => {
  test('should throw an error, if no input is provided', () => {
    expect(() => makePaxSensorData()).toThrow();
  });
});

describe('Test property node_id', () => {
  test('should throw an error, if letters are included', () => {
    paxData.node_id = '1111-111a';

    expect(() => makePaxSensorData(paxData)).toThrow();
  });

  test('should throw an error, if no dash included', () => {
    paxData.node_id = '12345678';

    expect(() => makePaxSensorData(paxData)).toThrow();
  });

  test('should throw an error, if no node_id is provided', () => {
    paxData.node_id = undefined;

    expect(() => makePaxSensorData(paxData)).toThrow();
  });
});

describe('Test property voltage', () => {
  test('should throw an error, if voltage is negative', () => {
    paxData.voltage = -1;

    expect(() => makePaxSensorData(paxData)).toThrow();
  });

  test('should not throw an error, if voltage is zero', () => {
    paxData.voltage = 0;

    expect(() => makePaxSensorData(paxData)).not.toThrow();
  });

  test('should not throw an error, if voltage is not provided', () => {
    paxData.voltage = undefined;

    expect(() => makePaxSensorData(paxData)).not.toThrow();
  });
});

describe('Test property time', () => {
  test('should throw an error, if no time is provided', () => {
    paxData.time = undefined;

    expect(() => makePaxSensorData(paxData)).toThrow();
  });

  test('should throw an error, if time is in the future', () => {
    paxData.time = new Date(new Date().getTime() + 1000);

    expect(() => makePaxSensorData(paxData)).toThrow();
  });
});
