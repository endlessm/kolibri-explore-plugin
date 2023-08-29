import { createTranslator } from 'kolibri.utils.i18n';

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
  WELCOME_ROOT: 'WELCOME_ROOT',
  WELCOME_PACK_SELECTION: 'WELCOME_PACK_SELECTION',
  WELCOME_PACK_READY: 'WELCOME_PACK_READY',
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

const searchTermsStrings = createTranslator('SearchTerms', {
  // Labels
  artsAndCrafts: 'Arts & Crafts',
  artsAndCraftsTerms: 'artist painting drawing arts crafts',
  careers: 'Careers',
  careersTerms: 'careers',
  cooking: 'Cooking',
  cookingTerms: 'cooking recipes desserts vegetables culinary',
  fitness: 'Fitness',
  fitnessTerms: 'fitness workouts stretches',
  games: 'Games',
  gamesTerms: 'games gaming maze gamers minecraft',
  math: 'Math',
  mathTerms: 'math',
  music: 'Music',
  musicTerms: 'music blues rhythm ukulele guitar',
  science: 'Science',
  scienceTerms: 'cool science physics biology gravity',
  sports: 'Sports',
  sportsTerms: 'sports soccer volleyball basketball football',
});

const searchTerms = new Map([
  ['artsAndCrafts', 'artsAndCraftsTerms'],
  ['careers', 'careersTerms'],
  ['cooking', 'cookingTerms'],
  ['fitness', 'fitnessTerms'],
  ['games', 'gamesTerms'],
  ['math', 'mathTerms'],
  ['music', 'musicTerms'],
  ['science', 'scienceTerms'],
  ['sports', 'sportsTerms'],
]);

export function getSearchTerms() {
  const out = new Map();
  for (const [k, v] of searchTerms) {
    out.set(searchTermsStrings.$tr(k), searchTermsStrings.$tr(v));
  }
  return out;
}

export const COLLECTIONS_PAGE_SIZE = 300;
export const SEARCH_MAX_RESULTS = 32;
