import { PageNames, PageModes } from '../../constants';

export function pageMode(state) {
  const topicsPages = [
    PageNames.TOPICS_ROOT,
    PageNames.TOPICS_CHANNEL,
    PageNames.TOPICS_TOPIC,
    PageNames.TOPICS_CONTENT,
  ];

  function pageNameMatches(page) {
    return page === state.pageName;
  }

  if (topicsPages.some(pageNameMatches)) {
    return PageModes.TOPICS;
  }

  return null;
}
