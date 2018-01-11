import * as PuppetDB from '../../PuppetDB';

type typeT = 'string' | 'integer' | 'boolean' | 'float' | 'array' | 'hash';

export type FactTree = {
  readonly path: PuppetDB.factPathT;
  readonly type: typeT | null;
  readonly children: ReadonlyArray<FactTree>;
};

export const factTree = (
  path: PuppetDB.factPathT,
  children: ReadonlyArray<FactTree>,
  type: typeT | null = null,
): FactTree => ({
  path,
  type,
  children,
});

// Get the all fact paths below `path`
const factPathChildren = (
  path: PuppetDB.factPathT,
  factPaths: ReadonlyArray<PuppetDB.factPathApiT>,
): ReadonlyArray<PuppetDB.factPathApiT> => {
  return factPaths.filter(fp => fp.path.slice(0, path.length) === path);
};

// Create a FactTree from an array of fact paths
export const fromFactPaths = (
  factPaths: ReadonlyArray<PuppetDB.factPathApiT>,
): FactTree => {
  const root = factTree([], [], 'hash');

  // Create intermediate nodes
  return map(node => {
    return node;
  }, root);

  factPaths.forEach((factPath: PuppetDB.factPathApiT) => {
    const node: FactTree = root;
    factPath.path
      .slice(0, -1)
      .forEach((pathElement: PuppetDB.factPathElementT) => {
        const child = getChild(pathElement, node);
        if (child === undefined || child === null) {
          const newChild = factTree([...node.path, pathElement], []);
          addChild(newChild, node);
          node = child;
        } else {
          node = child;
        }
      });

    node.addChild(new FactTree(factPath.path, [], factPath.type));
  });

  // Set node types
  root.walk((node: FactTree) => {
    if (node.type === undefined) {
      if (node.children.length > 0) {
        if (typeof node.children[0].name() === 'number') {
          node.setType('array');
        } else {
          node.setType('hash');
        }
      }
    }
  });

  // Set counts

  return root;
};

// The last element of our path
export const name = (factTree: FactTree): PuppetDB.factPathElementT => {
  return factTree.path[factTree.path.length - 1];
};

export const isLeaf = (factTree: FactTree): boolean => {
  return factTree.children.length === 0;
};

// Return child with specified name, or undefined if it doesn't exist
export const getChild = (
  child: PuppetDB.factPathElementT,
  factTree: FactTree,
): FactTree | null => {
  return factTree.children.find(fp => name(fp) === child) || null;
};

// Return fact tree with a new child added
export const addChild = (child: FactTree, factTree: FactTree): FactTree => ({
  ...factTree,
  children: [...factTree.children, child],
});

// walk the tree and call callback function on each node
// return false to stop iteration
export const walk = (
  callback: (node: FactTree) => boolean | void,
  factTree: FactTree,
): void => {
  if (callback(factTree) !== false) {
    factTree.children.forEach(child => walk(callback, child));
  }
};

// Map all nodes, from leafs and up, using callback to transform them
export const map = (
  callback: (node: FactTree) => FactTree,
  factTree: FactTree,
): FactTree =>
  callback({
    ...factTree,
    children: factTree.children.map(child => map(callback, child)),
  });

// Get total number of leafs below or at this node
export const numLeafs = (factTree: FactTree): number => {
  if (factTree.children.length === 0) {
    return 1;
  }
  return factTree.children
    .map(child => numLeafs(child))
    .reduce((a, b) => a + b);
};

// Check if it is an array with no grand children
// FIXME: what if we area an array of single key hashes?
export const arrayLeaf = (factTree: FactTree): boolean => {
  return (
    factTree.type === 'array' && numLeafs(factTree) === factTree.children.length
  );
};

export const setType = (type: typeT, factTree: FactTree): FactTree => ({
  ...factTree,
  type,
});

export const toJSON = (factTree: FactTree): JSON => ({
  ...factTree,
  children: factTree.children.map(c => toJSON(c)),
});
