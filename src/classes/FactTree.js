// @flow

import * as Immutable from 'immutable';

type typeT = 'string' | 'integer' | 'boolean' | 'float' | 'array' | 'hash';

export default class FactTree {
  path: factPathElementT[];
  type: ?typeT;
  children: FactTree[];

  constructor(path: factPathElementT[], children: FactTree[], type: ?typeT) {
    this.path = path;
    this.type = type;
    this.children = children;
  }

  static fromFactPaths(factPaths: factPathT[]): FactTree {
    const root = new FactTree([], [], 'hash');

    // Create intermediate nodes
    factPaths.forEach((factPath: factPathT) => {
      let node: FactTree = root;
      factPath.path.slice(0, -1).forEach((pathElement: factPathElementT) => {
        let child = node.getChild(pathElement);
        if (child === undefined || child === null) {
          child = new FactTree(node.path.concat([pathElement]), []);
          node.addChild(child);
          node = child;
        } else {
          node = child;
        }
      });

      node.addChild(new FactTree(factPath.path, [], factPath.type));
    });

    // Set node types

    return root;
  }

  // The last element of our path
  name(): factPathElementT {
    return this.path[this.path.length];
  }

  isLeaf(): boolean {
    return this.children.length === 0;
  }

  // Return child with specified name, or undefined if it doesn't exist
  getChild(child: factPathElementT): ?FactTree {
    return this.children.find(fp => fp.name() === child);
  }

  addChild(child: FactTree) {
    this.children.push(child);
  }
}
