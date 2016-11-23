// @flow

import FactTree from './FactTree';

test('it adds intermediate nodes', () => {
  const tree = FactTree.fromFactPaths([
    { type: 'string', path: ['networking', 'interfaces'] },
  ]);

  expect(tree).toEqual({
    path: [],
    type: 'hash',
    children: [
      {
        path: ['networking'],
        type: 'hash',
        children: [{
          path: ['networking', 'interfaces'],
          type: 'string',
          children: [],
        }] }] });
});
