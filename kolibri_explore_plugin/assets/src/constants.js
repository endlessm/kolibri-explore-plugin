// a name for every URL pattern
export const PageNames = {
  ROOT: 'ROOT',
  TOPICS_ROOT: 'TOPICS_ROOT',
  TOPICS_CHANNEL: 'TOPICS_CHANNEL',
  TOPICS_TEST: 'TOPICS_TEST',
  TOPICS_TOPIC: 'TOPICS_TOPIC',
  TOPICS_CONTENT: 'TOPICS_CONTENT',
  CONTENT_UNAVAILABLE: 'CONTENT_UNAVAILABLE',
  SEARCH: 'SEARCH',
  CONTENT: 'CONTENT',
  DOWNLOAD: 'DOWNLOAD',
};

// switch between modes
export const PageModes = {
  TOPICS: 'TOPICS',
};

export const pageNameToModuleMap = {
  [PageNames.TOPICS_ROOT]: 'topicsRoot',
  [PageNames.TOPICS_CHANNEL]: 'topicsTree',
  [PageNames.TOPICS_CONTENT]: 'topicsTree',
  [PageNames.TOPICS_TEST]: 'topicsTree',
  [PageNames.TOPICS_TOPIC]: 'topicsTree',
};

export const CUSTOM_PRESENTATION_TITLE = 'custom-channel-ui';

export const CarouselItemsLength = 5;
export const CarouselAllowedKinds = ['document', 'html5', 'video'];

export const searchTerms = new Map([
  ['Arts & Crafts', 'artist painting drawing arts crafts'],
  ['Careers', 'careers'],
  ['Cooking', 'cooking recipes desserts vegetables culinary'],
  ['Fitness', 'fitness workouts stretches'],
  ['Games', 'games gaming maze gamers minecraft'],
  ['Math', 'math'],
  ['Music', 'music blues rhythm ukulele guitar'],
  ['Science', 'cool science physics biology gravity'],
  ['Sports', 'sports soccer volleyball basketball football'],
]);

export const COLLECTIONS_PAGE_SIZE = 300;
export const SEARCH_MAX_RESULTS = 32;
