const createTranslator = window.kolibri.createTranslator;

// We have to call something called exactly ‘createTranslator’ for
// i18n-extract-messages to work. See the documentation in kolibriApi.js.
export const ekComponentsConstantsStrings = createTranslator('EkComponentsConstants', {
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
});

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
    return ekComponentsConstantsStrings.$tr(MediaTypeVerbs[id]);
  else
    return null;
}

export const MediaFilterName = 'Learning activity';
export const AuthorFilterName = 'author';
export const TagFilterName = 'common keywords';

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

export const DefaultKindLabel = 'resources';

// See https://github.com/learningequality/le-utils/blob/master/le_utils/constants/content_kinds.py
export const LabelPerKind = {
  video: 'videos',
  audio: 'audios',
  document: 'documents',
  html5: 'applications',
  zim: 'articles',
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
  return ekComponentsConstantsStrings.$tr(pack.titleId);
}

export function packMetadataSubtitle(pack) {
  return ekComponentsConstantsStrings.$tr(pack.subtitleId);
}

export default {
  AuthorFilterName,
  CarouselInterval,
  CollectionsSections,
  DefaultKindLabel,
  DownloadState,
  FilterTagsBadList,
  ItemsPerPage,
  ItemsPerSlide,
  KeywordIconSize,
  LabelPerKind,
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
