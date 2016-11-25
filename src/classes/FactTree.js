// @flow

import { List } from 'immutable';

type typeT = 'string' | 'integer' | 'boolean' | 'float' | 'array' | 'hash';

export default class FactTree {
  path: List<factPathElementT>;
  type: ?typeT;
  children: List<FactTree>;

  constructor(path: factPathElementT[], children: FactTree[], type: ?typeT) {
    this.path = List(path);
    this.type = type;
    this.children = List(children);
  }

  static fromFactPaths(factPaths: factPathT[]): FactTree {
    const root = new FactTree([], [], 'hash');

    // Create intermediate nodes
    factPaths.forEach((factPath: factPathT) => {
      let node: FactTree = root;
      factPath.path.slice(0, -1).forEach((pathElement: factPathElementT) => {
        let child = node.getChild(pathElement);
        if (child === undefined || child === null) {
          child = new FactTree(node.path.push(pathElement), List.of());
          node.addChild(child);
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
        if (node.children.size > 0) {
          if (typeof node.children.first().name() === 'number') {
            node.setType('array');
          } else {
            node.setType('hash');
          }
        }
      }
    });

    // Set counts

    return root;
  }

  // The last element of our path
  name(): factPathElementT {
    return this.path.last();
  }

  isLeaf(): boolean {
    return this.children.length === 0;
  }

  // Return child with specified name, or undefined if it doesn't exist
  getChild(child: factPathElementT): ?FactTree {
    return this.children.find(fp => fp.name() === child);
  }

  addChild(child: FactTree) {
    this.children = this.children.push(child);
  }

  // walk the tree and call callback function on each node
  // return false to stop iteration
  walk(callback: (node: FactTree) => boolean | void) {
    if (callback(this) !== false) {
      this.children.forEach(child => child.walk(callback));
    }
  }

  // Get total number of leafs below or at this node
  numLeafs(): number {
    if (this.children.size === 0) {
      return 1;
    }
    return this.children.map(child => child.numLeafs())
      .reduce((a, b) => a + b);
  }

  // Check if it is an array with no grand children
  // FIXME: what if we area an array of single key hashes?
  arrayLeaf(): boolean {
    return (this.type === 'array' && this.numLeafs() === this.children.size);
  }

  setType(type: typeT) {
    this.type = type;
  }

  toJSON() {
    return ({
      path: this.path.toJS(),
      type: this.type,
      children: this.children.toJSON(),
    });
  }
}
