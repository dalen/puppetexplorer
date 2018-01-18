import * as Decoder from 'type-safe-json-decoder';

// Fact paths as returned by the API
// the types 'parent' is created to represent intermediate paths
export type FactPath = {
  readonly path: ReadonlyArray<string | number>;
  readonly type: 'parent' | 'string' | 'integer' | 'boolean' | 'float';
};

// Create a FactPath
const create = (
  path: ReadonlyArray<string | number>,
  type: 'parent' | 'string' | 'integer' | 'boolean' | 'float',
): FactPath => ({ path, type });

// Create intermediate paths
export const intermediatePaths = (factPaths: ReadonlyArray<FactPath>) =>
  [...factPaths]
    // Sort up the paths, so we know parent paths always come before children
    .sort((a, b) => {
      if (a.path < b.path) {
        return -1;
      }
      if (a.path > b.path) {
        return 1;
      }
      return 0;
    })
    // Go through paths and add any missing parents
    .reduce((ret: ReadonlyArray<FactPath>, path: FactPath) => {
      // For each path element, see if that parent path exists
      const extraPaths: ReadonlyArray<FactPath> = path.path
        .slice(0, -1)
        .reduce(
          (
            extra: ReadonlyArray<FactPath>,
            _: string | number,
            index: number,
          ) => {
            // The path we are looking for
            const curPath = path.path.slice(0, index + 1);
            // See if the current path we are looking for exists
            if (ret.find(p => p.path.join('.') === curPath.join('.'))) {
              // We found it, so add no extra path
              return extra;
            }
            // We didn't find it, so add it
            return [...extra, create(curPath, 'parent')];
          },
          [],
        );
      return [...ret, ...extraPaths, path];
    }, []);

// Get the all fact paths below `path`
export const children = (
  path: FactPath,
  factPaths: ReadonlyArray<FactPath>,
): ReadonlyArray<FactPath> =>
  factPaths.filter(fp => fp.path.slice(0, path.path.length) === path.path);

// Get the children directly below path
export const directChildren = (
  path: FactPath,
  factPaths: ReadonlyArray<FactPath>,
): ReadonlyArray<FactPath> =>
  factPaths.filter(fp => fp.path.length === path.path.length + 1);

// Get all the top level paths
export const topLevel = (
  factPaths: ReadonlyArray<FactPath>,
): ReadonlyArray<FactPath> => factPaths.filter(path => path.path.length === 1);

// See if path is a leaf node
export const isLeaf = (
  path: FactPath,
  factPaths: ReadonlyArray<FactPath>,
): boolean => children(path, factPaths).length === 0;

const factPathDecoder: Decoder.Decoder<ReadonlyArray<FactPath>> = Decoder.array(
  Decoder.object(
    ['path', Decoder.array(Decoder.union(Decoder.number(), Decoder.string()))],
    [
      'type',
      Decoder.union(
        Decoder.equal<'string'>('string'),
        Decoder.equal<'integer'>('integer'),
        Decoder.equal<'boolean'>('boolean'),
        Decoder.equal<'float'>('float'),
      ),
    ],
    (path, type) => ({ path, type }),
  ),
);

// Check if it is an array with no grand children
// FIXME: what if we are an array of single key hashes?
export const isArrayLeaf = (
  factPath: FactPath,
  factPaths: ReadonlyArray<FactPath>,
): boolean => {
  return directChildren(factPath, factPaths).every(
    child =>
      isLeaf(child, factPaths) && typeof child.path.slice(-1)[0] === 'number',
  );
};

export const get = (serverUrl: string): Promise<ReadonlyArray<FactPath>> => {
  const url = `${serverUrl}/pdb/query/v4/fact-paths`;

  return fetch(url, {
    headers: new Headers({ Accept: 'application/json' }),
  }).then(response =>
    response.text().then(text => factPathDecoder.decodeJSON(text)),
  );
};

// The last element of our path
export const name = (factPath: FactPath): string => {
  return factPath.path[factPath.path.length - 1].toString();
};
