function getEkComponentsConstantsTranslator() {
  const createTranslator = window.kolibri.createTranslator;

  // We have to call something called exactly ‘createTranslator’ for
  // i18n-extract-messages to work. See the documentation in kolibriApi.js.
  // This relies on createTranslator() caching the translator for us.
  return createTranslator('EkComponentsConstants', {
    // For MediaTypeVerbs
    discoverVerb: {
      message: 'Discover',
      context: 'Verb for using a media type',
    },
    watchVerb: {
      message: 'Watch',
      context: 'Verb for using a media type',
    },
    listenVerb: {
      message: 'Listen',
      context: 'Verb for using a media type',
    },
    readVerb: {
      message: 'Read',
      context: 'Verb for using a media type',
    },
    practiceVerb: {
      message: 'Practice',
      context: 'Verb for using a media type',
    },
    interactVerb: {
      message: 'Interact',
      context: 'Verb for using a media type',
    },

    // For PackMetadata
    explorerTitle: {
      message: 'Explorer',
      context: 'Title of a content pack',
    },
    explorerSubtitle: {
      message: 'I like to learn about different cultures, places and ideas.',
      context: 'Subtitle of a content pack',
    },
    artistTitle: {
      message: 'Artist',
      context: 'Title of a content pack',
    },
    artistSubtitle: {
      message: 'I am creative and enjoy making things, music and dancing.',
      context: 'Subtitle of a content pack',
    },
    scientistTitle: {
      message: 'Scientist',
      context: 'Title of a content pack',
    },
    scientistSubtitle: {
      message: 'I love to investigate the world and do fun experiments.',
      context: 'Subtitle of a content pack',
    },
    inventorTitle: {
      message: 'Inventor',
      context: 'Title of a content pack',
    },
    inventorSubtitle: {
      message: 'I like to build things and solve problems.',
      context: 'Subtitle of a content pack',
    },
    athleteTitle: {
      message: 'Athlete',
      context: 'Title of a content pack',
    },
    athleteSubtitle: {
      message: 'I like to move my body and be with friends.',
      context: 'Subtitle of a content pack',
    },
    curiousTitle: {
      message: 'Curious',
      context: 'Title of a content pack',
    },
    curiousSubtitle: {
      message: 'I like to experiment with a bit of everything.',
      context: 'Subtitle of a content pack',
    },

    // For filters:
    mediaFilterLabel: {
      message: 'Learning activity',
      context: 'Label for filtering by activity type',
    },
    authorFilterLabel: {
      message: 'Author',
      context: 'Label for filtering by author',
    },
    tagFilterLabel: {
      message: 'Common keywords',
      context: 'Label for filtering by tag',
    },
  });
}

// This maps to a translation ID. Use mediaTypeVerb() to translate it.
export const MediaTypeVerbs = {
  'bundle': 'discoverVerb',
  'video': 'watchVerb',
  'audio': 'listenVerb',
  'document': 'readVerb',
  'exercise': 'practiceVerb',
  'html5': 'interactVerb',
  'zim': 'interactVerb',
  'slideshow': 'interactVerb',
  'h5p': 'interactVerb',
  'quiz': 'interactVerb',
};

export function mediaTypeVerb(id) {
  if (id in MediaTypeVerbs)
    return getEkComponentsConstantsTranslator().$tr(MediaTypeVerbs[id]);
  else
    return null;
}

export const MediaFilterName = 'by-media-type';
export const AuthorFilterName = 'by-author';
export const TagFilterName = 'by-tag';

// This maps to a translation ID. Use filterLabel() to translate it.
export const filterLabels = {
  'by-media-type': 'mediaFilterLabel',
  'by-author': 'authorFilterLabel',
  'by-tag': 'tagFilterLabel',
};

export function filterLabel(id) {
  if (id in filterLabels)
    return getEkComponentsConstantsTranslator().$tr(filterLabels[id]);
  else
    return null;
}

export const MediaQuality = {
  LOW: 'low',
  REGULAR: 'regular',
};

export const DownloadState = {
  NOT_CHECKED: 'not-checked',
  READY: 'ready',
  DOWNLOADING: 'downloading',
  COMPLETED: 'completed',
  FAILED: 'failed',
};

export const StructuredTags = {
  TOPIC: 'topic',
  SUBJECT: 'subject',
  LEVEL: 'level',
  GRADE: 'grade',
  TYPE: 'type',
  DURATION: 'duration',
};

export const FilterTagsBadList = ['duration'];

export const StructuredTagsRegExp = new RegExp('(.*)=(.*)');

export const ThumbnailSize = {
  width: 128,
  height: 128,
}

export const CarouselInterval = 10000;

export const ItemsPerSlide = {lg: 4, md: 2, sm: 1};
export const ItemsPerPage = 16;

export const KeywordIconSize = 20;
export const SearchBarDebounce = 2000;

export const CollectionsSections = ['highlight', 'skill', 'career', 'curious'];

export const PackMetadata = [
    {
        id: 'explorer',
        titleId: 'explorerTitle',
        subtitleId: 'explorerSubtitle',
    },
    {
        id: 'artist',
        titleId: 'artistTitle',
        subtitleId: 'artistSubtitle',
    },
    {
        id: 'scientist',
        titleId: 'scientistTitle',
        subtitleId: 'scientistSubtitle',
    },
    {
        id: 'inventor',
        titleId: 'inventorTitle',
        subtitleId: 'inventorSubtitle',
    },
    {
        id: 'athlete',
        titleId: 'athleteTitle',
        subtitleId: 'athleteSubtitle',
    },
    {
        id: 'curious',
        titleId: 'curiousTitle',
        subtitleId: 'curiousSubtitle',
    },
];

export function packMetadataTitle(pack) {
  return getEkComponentsConstantsTranslator().$tr(pack.titleId);
}

export function packMetadataSubtitle(pack) {
  return getEkComponentsConstantsTranslator().$tr(pack.subtitleId);
}

export default {
  AuthorFilterName,
  CarouselInterval,
  CollectionsSections,
  DownloadState,
  FilterTagsBadList,
  filterLabels,
  filterLabel,
  ItemsPerPage,
  ItemsPerSlide,
  KeywordIconSize,
  MediaFilterName,
  MediaQuality,
  MediaTypeVerbs,
  mediaTypeVerb,
  PackMetadata,
  packMetadataTitle,
  packMetadataSubtitle,
  SearchBarDebounce,
  StructuredTags,
  StructuredTagsRegExp,
  TagFilterName,
  ThumbnailSize,
};
