import get from 'lodash/get';

import {
  StructuredTagsRegExp,
  StructuredTags,
} from './constants';

function getEkComponentsUtilsTranslator() {
  const createTranslator = window.kolibri.createTranslator;

  // We have to call something called exactly ‘createTranslator’ for
  // i18n-extract-messages to work. See the documentation in kolibriApi.js.
  // This relies on createTranslator() caching the translator for us.
  return createTranslator('EkComponentsUtils', {
    // For getTopicCardSubtitle and getCardSubtitle
    videoCardSubtitle: {
      message: '{count, number} {count, plural, one {video} other {videos}}',
      context: 'Subtitle for a topic card containing a video',
    },
    audioCardSubtitle: {
      message: '{count, number} {count, plural, one {audio} other {audios}}',
      context: 'Subtitle for a topic card containing an audio',
    },
    documentCardSubtitle: {
      message: '{count, number} {count, plural, one {document} other {documents}}',
      context: 'Subtitle for a topic card containing a document',
    },
    htmlCardSubtitle: {
      message: '{count, number} {count, plural, one {application} other {applications}}',
      context: 'Subtitle for a topic card containing an HTML application',
    },
    zimCardSubtitle: {
      message: '{count, number} {count, plural, one {article} other {articles}}',
      context: 'Subtitle for a topic card containing a zim article',
    },
    resourceCardSubtitle: {
      message: '{count, number} {count, plural, one {resource} other {resources}}',
      context: 'Subtitle for a topic card containing a generic resource',
    },
    cardSubtitleByline: {
      message: 'by {by_line}',
      context: 'Subtitle for a non-topic card when a byline needs to be shown',
    },
  });
}

/** Structured tags **/

export function getAllStructuredTags(node, matchKey) {
  return get(node.structuredTags, matchKey, []);
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

export function addStructuredTag(node) {
    // Add structured tags to the node metadata:
    node.structuredTags = {};
    Object.values(StructuredTags).forEach((matchKey) => {
      const tags = getStructuredTags(node, matchKey);
      node.structuredTags[matchKey] = tags;
    });
    return node;
};

export function updateExploreNodeUrl(node) {
    const base = `/topics/${node.channel_id}`;
    if (node.kind === 'topic') {
        node.nodeUrl = `${base}/t/${node.id}`;
    } else {
        node.nodeUrl = `${base}/c/${node.id}`;
    }
    return node;
};

export function addChannelToNode(rootNodes, node) {
  node.channel = rootNodes.find(c => c.id === node.channel_id);
  return node;
}

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
  const count = node.children_count || leaves.length;
  const translator = getEkComponentsUtilsTranslator();

  // See https://github.com/learningequality/le-utils/blob/master/le_utils/constants/content_kinds.py
  if (uniqueLeavesKinds.size > 1) {
    return translator.$tr('resourceCardSubtitle', { count: count });
  } else {
    const kind = uniqueLeavesKinds.values().next().value;

    switch (kind) {
      case 'video':
        return translator.$tr('videoCardSubtitle', { count: count });
      case 'audio':
        return translator.$tr('audioCardSubtitle', { count: count });
      case 'document':
        return translator.$tr('documentCardSubtitle', { count: count });
      case 'html':
        return translator.$tr('htmlCardSubtitle', { count: count });
      case 'zim':
        return translator.$tr('zimCardSubtitle', { count: count });
      default:
        return translator.$tr('resourceCardSubtitle', { count: count });
    }
  }
};

export function getCardSubtitle(node, fallback) {
  if (node.kind === 'topic') {
    return getTopicCardSubtitle(node);
  }
  const byLine = node.author || node.license_owner || fallback;

  if (byLine)
    return getEkComponentsUtilsTranslator().$tr('cardSubtitleByline', { by_line: byLine });
  else
    return '';
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

/** Validators **/

export function validateItemsPerSlide(value) {
  return 'sm' in value && 'md' in value && 'lg' in value;
}

// Borrowed from https://stackoverflow.com/a/40975730
export function getDayOfYearNumber() {
    const date = new Date();
    return (
        (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
         Date.UTC(date.getFullYear(), 0, 0)) /
            24 /
            60 /
            60 /
            1000
    );
}


export default {
  getAllStructuredTags,
  getFirstStructuredTag,
  getStructuredTags,
  getNodeUrl,
  getLeaves,
  getTopicCardSubtitle,
  getCardSubtitle,
  getSlug,
  getDayOfYearNumber,
  validateItemsPerSlide,
  addStructuredTag,
  updateExploreNodeUrl,
  addChannelToNode,
};
