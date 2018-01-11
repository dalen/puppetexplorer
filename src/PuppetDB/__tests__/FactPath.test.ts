import * as FactPath from '../FactPath';

describe('intermediatePaths', () => {
  const paths: ReadonlyArray<FactPath.FactPath> = [
    { path: ['a', 'b'], type: 'boolean' },
  ];

  it('creates intermediate paths', () => {
    expect(FactPath.intermediatePaths(paths)).toEqual([
      { path: ['a'], type: 'parent' },
      { path: ['a', 'b'], type: 'boolean' },
    ]);
  });
});
