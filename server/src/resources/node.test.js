// Copyright (c) 2022 FHNW, Switzerland. All rights reserved.
// Licensed under MIT License, see LICENSE for details.

import makeNode from "./node";

let node;

beforeEach(() => {
  node = {
    node_id: '1111-2222',
    location_id: 1,
    type: 'env',
    description: 'Description'
  };
});

describe('Test with valid input', () => {
  test('should create node with valid input', () => {
    const createdNode = makeNode(node);

    expect(createdNode).toBeDefined();
    expect(createdNode).toEqual(node);
  });

  test('should prevent from modifying created data', () => {
    const createdNode = makeNode(node);

    expect(() => {
      createdNode.location = 2;
    }).toThrow();
  });
});

describe('Test without any inputs', () => {
  test('should throw an error, if no input is provided', () => {
    expect(() => makeNode()).toThrow();
  });
});

describe('Test property node_id', () => {
  test('should throw an error, if letters are included', () => {
    node.node_id = '1111-111a';

    expect(() => makeNode(node)).toThrow();
  });

  test('should throw an error, if no dash included', () => {
    node.node_id = '12345678';

    expect(() => makeNode(node)).toThrow();
  });

  test('should throw an error, if no node_id is provided', () => {
    node.node_id = undefined;

    expect(() => makeNode(node)).toThrow();
  });
});

describe('Test property location_id', () => {
  test('should throw an error, if no location_id is provided', () => {
    node.location_id = undefined;

    expect(() => makeNode(node)).toThrow();
  });

  test('should throw an error, if location_id is not a number', () => {
    node.location_id = '1';

    expect(() => makeNode(node)).toThrow();
  });

  test('should throw an error, if location_id is not an integer', () => {
    node.location_id = 1.5;

    expect(() => makeNode(node)).toThrow();
  });
});

describe('Test property type', () => {
  test('should throw an error, if no type is provided', () => {
    node.type = undefined;

    expect(() => makeNode(node)).toThrow();
  });

  test('should throw an error, if type is not a predefined one', () => {
    node.type = 'envv';

    expect(() => makeNode(node)).toThrow();
  });
});
