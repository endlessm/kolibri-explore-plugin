import {
  StructuredTagsRegExp,
  StructuredTags,
  DefaultKindLabel,
  LabelPerKind,
} from './constants';

/** Structured tags **/

export function getFirstStructuredTag(node, matchKey) {
  if (!(matchKey in node.structuredTags)) {
    return null;
  }
  const tags = node.structuredTags[matchKey];
  if (!tags.length) {
    return null;
  }
  return tags[0];
};

export function getStructuredTags(node, matchKey) {
  if (!node.tags) {
    return [];
  }
  const tagValues = node.tags
    .filter((t) => t.match(StructuredTagsRegExp))
    .map((t) => t.match(StructuredTagsRegExp))
    .filter(([, key]) => key === matchKey)
    .map(([,, value]) => value);
  return tagValues;
}

function addStructuredTag(n) {
    // Add structured tags to the node metadata:
    n.structuredTags = {};
    Object.values(StructuredTags).forEach((matchKey) => {
      const tags = getStructuredTags(n, matchKey);
      n.structuredTags[matchKey] = tags;
    });
    return n;
};

export function parseNodes(nodes, isBundle=false) {
  return nodes.map(addStructuredTag).map((n) => {
    // Use the parent URL in leaf nodes if the channel is a bundle:
    if (isBundle && n.kind !== 'topic' && n.parent) {
      n.nodeUrl = `/t/${n.parent}`;
    }
    return n;
  });
};

/** Card information **/

export function getNodeUrl(node, channelId) {
  if (node.nodeUrl) {
    return node.nodeUrl;
  }

  if (node.id === channelId) {
    return '/';
  }
  if (node.kind === 'topic') {
    return `/t/${node.id}`;
  }
  return `/c/${node.id}`;
};

export function getLeaves(node) {
  if (!node.children) {
    if (node.kind === 'topic') {
      return [];
    }
    return [node];
  }
  return node.children
    .map(getLeaves)
    .reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
};

export function getTopicCardSubtitle(node) {
  const leaves = getLeaves(node);
  const leavesKinds = leaves.map((leaf) => leaf.kind);
  const uniqueLeavesKinds = new Set(leavesKinds);
  let kindsLabel;
  if (uniqueLeavesKinds.size > 1) {
    kindsLabel = DefaultKindLabel;
  } else {
    const kind = uniqueLeavesKinds.values().next().value;
    kindsLabel = LabelPerKind[kind] || DefaultKindLabel;
  }
  return `${leaves.length} ${kindsLabel}`;
};

export function getCardSubtitle(node, fallback) {
  if (node.kind === 'topic') {
    return getTopicCardSubtitle(node);
  }
  const byLine = node.author || node.license_owner || fallback;
  return byLine ? `by ${byLine}` : '';
};

export default {
  getFirstStructuredTag,
  getStructuredTags,
  parseNodes,
  getNodeUrl,
  getLeaves,
  getTopicCardSubtitle,
  getCardSubtitle,
};
