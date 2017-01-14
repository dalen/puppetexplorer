// @flow

import FactTree from './FactTree';

test('it adds intermediate nodes', () => {
  const tree = FactTree.fromFactPaths([
    { type: 'string', path: ['networking', 'ipaddress'] },
  ]);

  expect(tree.toJSON()).toEqual({
    path: [],
    type: 'hash',
    children: [
      {
        path: ['networking'],
        type: 'hash',
        children: [{
          path: ['networking', 'ipaddress'],
          type: 'string',
          children: [],
        }] }] });
});

test('it sets types correctly', () => {
  const tree = FactTree.fromFactPaths([
    { type: 'string', path: ['networking', 'ipaddress'] },
    { type: 'string', path: ['processors', 'models', 0] },
  ]);

  expect(tree.toJSON()).toEqual({
    path: [],
    type: 'hash',
    children: [
      {
        path: ['networking'],
        type: 'hash',
        children: [{
          path: ['networking', 'ipaddress'],
          type: 'string',
          children: [],
        }],
      },
      {
        path: ['processors'],
        type: 'hash',
        children: [{
          path: ['processors', 'models'],
          type: 'array',
          children: [{
            path: ['processors', 'models', 0],
            type: 'string',
            children: [],
          }],
        }],
      },
    ],
  });
});

test('numLeafs()', () => {
  const tree = FactTree.fromFactPaths([
    { type: 'string', path: ['networking', 'ipaddress'] },
    { type: 'string', path: ['processors', 'models', 0] },
  ]);

  expect(tree.numLeafs()).toEqual(2);
});
