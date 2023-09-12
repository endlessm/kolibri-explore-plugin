import { PageNames } from '../constants';

// This file was created to have the core navigation routes available
// without any other dependencies such as handlers, components, etc.

export default {
  home: {
    name: PageNames.ROOT,
    path: '/',
  },
  topicsRoot: {
    name: PageNames.TOPICS_ROOT,
    path: '/topics',
  },
  search: {
    name: PageNames.SEARCH,
    path: '/search',
  },
};
