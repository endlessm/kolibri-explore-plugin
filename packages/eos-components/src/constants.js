export const MediaTypeVerbs = {
  'bundle': 'Discover',
  'video': 'Watch',
  'audio': 'Listen',
  'document': 'Read',
  'exercise': 'Practice',
  'html5': 'Interact',
  'zim': 'Interact',
};

export const MediaFilterName = 'Learning activity';
export const AuthorFilterName = 'author';
export const TagFilterName = 'common keywords';

export const MediaQuality = {
  LOW: 'low',
  REGULAR: 'regular',
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

export const ItemsPerSlide = 4;
export const ItemsPerPage = 16;

export default {
  AuthorFilterName,
  CarouselInterval,
  DefaultKindLabel,
  FilterTagsBadList,
  ItemsPerPage,
  ItemsPerSlide,
  LabelPerKind,
  MediaFilterName,
  MediaQuality,
  MediaTypeVerbs,
  StructuredTags,
  StructuredTagsRegExp,
  TagFilterName,
  ThumbnailSize,
};
