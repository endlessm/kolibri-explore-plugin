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
  ['Arts', 'artist music painting drawing arts'],
  ['Careers', 'career college degrees personality'],
  ['Cooking', 'recipes desserts meat vegetables bread culinary'],
  ['Fitness', 'fitness yoga workout'],
  ['Games', 'games gamers gaming the maze'],
  ['Maths', 'mathematics'],
  ['Music', 'blues rhythm ukulele guitar beatbox'],
  ['Science', 'cool science sciences physics biology molecules gravity'],
  ['Sports', 'football soccer dribbling volley tennis skating'],
]);

export const COLLECTIONS_PAGE_SIZE = 300;
