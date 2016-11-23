// @flow

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
    root.walk((node: FactTree) => {
      if (node.type === undefined) {
        if (node.children.length > 0) {
          if (typeof node.children[0].path[node.children[0].path.length - 1] === 'number') {
            node.setType('array');
          } else {
            node.setType('hash');
          }
        }
      }
    });

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

  // walk the tree and call callback function on each node
  // return false to stop iteration
  walk(callback: (ft: FactTree) => boolean | void) {
    if (callback(this) !== false) {
      this.children.forEach(child => child.walk(callback));
    }
  }

  setType(type: typeT) {
    this.type = type;
  }

  toJSON() {
    return ({
      path: this.path,
      type: this.type,
      children: this.children.map(child => child.toJSON()),
    });
  }
}
