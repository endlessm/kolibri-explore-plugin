import arrayToTree from 'array-to-tree';

export function getNodesTree(nodes) {
  return arrayToTree(nodes, { parentProperty: 'parent' });
}

export function recursiveExistsNodes(node, fn) {
  if (fn(node)) {
    return true;
  }

  if (node.children) {
    return node.children.some((leaf) => recursiveExistsNodes(leaf, fn));
  }

  return false;
}

// Return the node and its children as a flatten array.
export function flattenNodes(node) {
  if (!node.children) {
    return [node];
  }
  const childrenNodes = node.children.flatMap(flattenNodes);
  return [node, ...childrenNodes];
}
