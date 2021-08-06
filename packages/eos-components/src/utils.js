import {
  StructuredTagsRegExp,
  StructuredTags,
} from './constants';

/** Structured tags **/

export function getAllStructuredTags(node, matchKey) {
  if (!('structuredTags' in node) || !(matchKey in node.structuredTags)) {
    return [];
  }
  return node.structuredTags[matchKey];
};

export function getFirstStructuredTag(node, matchKey) {
  const tags = getAllStructuredTags(node, matchKey);
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

export function getTopicCardSubtitle() {
  // FIXME
  return 'N resources';
};

export function getCardSubtitle(node, fallback) {
  if (node.kind === 'topic') {
    return getTopicCardSubtitle(node);
  }
  const byLine = node.author || node.license_owner || fallback;
  return byLine ? `by ${byLine}` : '';
};

export function getSlug(title) {
  return title
    .toLowerCase()
    .replace(/&/g, 'and')
    // Remove invalid characters
    .replace(/[^a-z0-9 -]/g, '')
    // Replace whitespace by -
    .replace(/\s+/g, '-')
    // Collapse dashes
    .replace(/-+/g, '-');
}

export default {
  getAllStructuredTags,
  getFirstStructuredTag,
  getStructuredTags,
  parseNodes,
  getNodeUrl,
  getTopicCardSubtitle,
  getCardSubtitle,
  getSlug,
};
