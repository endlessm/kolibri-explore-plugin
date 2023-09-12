import { createTranslator } from 'kolibri.utils.i18n';

export const exploreStrings = createTranslator('CommonExploreStrings', {
  // Labels
  exploreLabel: 'Explore',
  discoveryLabel: 'Discovery',
  libraryLabel: 'Library',
});

export default {
  methods: {
    exploreString(key, args) {
      return exploreStrings.$tr(key, args);
    },
  },
};
