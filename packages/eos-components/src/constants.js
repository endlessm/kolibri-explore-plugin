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

export const ItemsPerSlide = {lg: 4, md: 2, sm: 1};
export const ItemsPerPage = 16;

export const KeywordIconSize = 20;
export const SearchBarDebounce = 2000;

export const CollectionsSections = ['highlight', 'skill', 'career', 'curious'];

export const PackMetadata = [
    {
        id: 'explorer',
        title: 'Explorer',
        subtitle: 'I like to learn about different cultures, places and ideas.',
    },
    {
        id: 'artist',
        title: 'Artist',
        subtitle: 'I am creative and enjoy making things, music and dancing.',
    },
    {
        id: 'scientist',
        title: 'Scientist',
        subtitle: 'I love to investigate the world and do fun experiments.',
    },
    {
        id: 'inventor',
        title: 'Inventor',
        subtitle: 'I like to build things and solve problems.',
    },
    {
        id: 'athlete',
        title: 'Athlete',
        subtitle: 'I like to move my body and spend time with friends.',
    },
    {
        id: 'curious',
        title: 'Curious',
        subtitle: 'I like to experiment a bit of everything.',
    },
];

export default {
  AuthorFilterName,
  CarouselInterval,
  CollectionsSections,
  DefaultKindLabel,
  FilterTagsBadList,
  ItemsPerPage,
  ItemsPerSlide,
  KeywordIconSize,
  LabelPerKind,
  MediaFilterName,
  MediaQuality,
  MediaTypeVerbs,
  PackMetadata,
  SearchBarDebounce,
  StructuredTags,
  StructuredTagsRegExp,
  TagFilterName,
  ThumbnailSize,
};
