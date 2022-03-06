// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import makeEnvSensorData from './envSensorData';

let envData;

beforeEach(() => {
  envData = {
    node_id: '1111-2222',
    voltage: 10,
    temperature: 24,
    humidity: 36,
    moisture: 156,
    time: new Date(new Date().getTime() - 1000).toISOString(),
  };
});

describe('Test with valid input', () => {
  test('should create env data with valid input', () => {
    const envSensorData = makeEnvSensorData(envData);

    expect(envSensorData).toBeDefined();
    expect(envSensorData).toEqual({
      ...envData,
      voltageUnit: 'V',
      temperatureUnit: '°C',
      humidityUnit: '%',
      moistureUnit: '%',
    });
  });
  test('should prevent from modifying created data', () => {
    let envSensorData = makeEnvSensorData(envData);

    expect(() => {
      envSensorData.voltage = 100;
    }).toThrow();
  });
});

describe('Test without any data', () => {
  test('should throw an error, if no input is provided', () => {
    expect(() => makeEnvSensorData()).toThrow();
  });
});

describe('Test property node_id', () => {
  test('should throw an error, if letters are included', () => {
    envData.node_id = '1111-111a';

    expect(() => makeEnvSensorData(envData)).toThrow();
  });

  test('should throw an error, if no dash included', () => {
    envData.node_id = '12345678';

    expect(() => makeEnvSensorData(envData)).toThrow();
  });

  test('should throw an error, if no node_id is provided', () => {
    envData.node_id = undefined;

    expect(() => makeEnvSensorData(envData)).toThrow();
  });
});

describe('Test property voltage', () => {
  test('should throw an error, if voltage is negative', () => {
    envData.voltage = -1;

    expect(() => makeEnvSensorData(envData)).toThrow();
  });

  test('should not throw an error, if voltage is zero', () => {
    envData.voltage = 0;

    expect(() => makeEnvSensorData(envData)).not.toThrow();
  });

  test('should not throw an error, if voltage is not provided', () => {
    envData.voltage = undefined;

    expect(() => makeEnvSensorData(envData)).not.toThrow();
  });
});

describe('Test property humidity', () => {
  test('should not throw an error, if humidity is not provided', () => {
    envData.humidity = undefined;

    expect(() => makeEnvSensorData(envData)).not.toThrow();
  });

  test('should not throw an error, if humidity is zero', () => {
    envData.humidity = 0;

    expect(() => makeEnvSensorData(envData)).not.toThrow();
  });

  test('should not throw an error, if humidity is 100', () => {
    envData.humidity = 100;

    expect(() => makeEnvSensorData(envData)).not.toThrow();
  });

  test('should throw an error, if humidity is negative', () => {
    envData.humidity = -1;

    expect(() => makeEnvSensorData(envData)).toThrow();
  });

  test('should throw an error, if humidity is over 100', () => {
    envData.humidity = 101;

    expect(() => makeEnvSensorData(envData)).toThrow();
  });
});

describe('Test property time', () => {
  test('should throw an error, if no time is provided', () => {
    envData.time = undefined;

    expect(() => makeEnvSensorData(envData)).toThrow();
  });

  test('should throw an error, if time is in the future', () => {
    envData.time = new Date(new Date().getTime() + 1000);

    expect(() => makeEnvSensorData(envData)).toThrow();
  });
});
