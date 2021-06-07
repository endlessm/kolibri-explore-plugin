export const MediaTypeVerbs = {
  'video': 'Watch',
  'audio': 'Listen',
  'document': 'Read',
  'exercise': 'Practice',
  'html5': 'Interact',
};

export const MediaQuality = {
  LOW: 'low',
  REGULAR: 'regular',
  HIGH: 'high',
};

export const DefaultKindLabel = 'items';

// See https://github.com/learningequality/le-utils/blob/master/le_utils/constants/content_kinds.py
export const LabelPerKind = {
  video: 'videos',
  audio: 'audios',
  document: 'documents',
  html5: 'applications',
};

export const StructuredTags = {
  TOPIC: 'topic',
  SUBJECT: 'subject',
  LEVEL: 'level',
  GRADE: 'grade',
  TYPE: 'type',
  DURATION: 'duration',
};

export const StructuredTagsRegExp = new RegExp('(.*)=(.*)');

export default {
  DefaultKindLabel,
  LabelPerKind,
  MediaQuality,
  MediaTypeVerbs,
  StructuredTags,
  StructuredTagsRegExp,
};
