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

export const CarouselItems = 5;

export const searchTerms = [
  'Arts',
  'Careers',
  'Cooking',
  'Fitness',
  'Games',
  'Maths',
  'Music',
  'Science',
  'Sports',
];

export const searchTermSynonyms = {
  arts: 'artist music painting drawing arts',
  careers: 'career college degrees personality',
  cooking: 'recipes desserts meat vegetables bread culinary',
  fitness: 'fitness yoga workout',
  games: 'games gamers gaming the maze',
  maths: 'mathematics',
  music: 'blues rhythm ukulele guitar beatbox',
  science: 'cool science sciences physics biology molecules gravity',
  sports: 'football soccer dribbling volley tennis skating',
};
