<template>
  <div id="app" class="d-flex flex-column h-100">
    <!-- Wrapper needed to fix flexbox footer positioning on IE11 -->
    <div class="flex-fill flex-shrink-0">
      <router-view />
    </div>
    <ChannelFooter />
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'App',
  computed: {
    ...mapState(['hasFilters', 'hasFlatGrid']),
  },
  created() {
    window.kolibri.themeRenderer({
        appBarColor: null,
        textColor: null,
        backdropColor: null,
        backgroundColor: null,
    });
    console.debug(`Running under Kolibri version: ${window.kolibri.version}`);
    const promises = [];

    const channelPromise = window.kolibri.getChannelMetadata()
      .then((channel) => {
        this.$store.commit('setChannelInformation', { channel });
      });
    promises.push(channelPromise);

    if (this.hasFilters) {
      const filterOptionsPromise = window.kolibri.getChannelFilterOptions()
        .then((filterOptions) => {
          this.$store.commit('filters/setFilterOptions', filterOptions);
        });
      promises.push(filterOptionsPromise);
    }

    // Flat presentations don't need the main sections:
    if (!this.hasFlatGrid) {
      const sectionsPromise = window.kolibri.getContentByFilter({ parent: 'self', onlyTopics: true })
        .then((page) => {
          this.$store.commit('setMainSections', { mainSections: page.results });
          this.handleRedirects();
        });
      promises.push(sectionsPromise);
    }

    return Promise.all(promises);
  },
  methods: {
    handleRedirects() {
      const uri = window.location.search.substring(1);
      const params = new URLSearchParams(uri);
      // Check if we need to navigate to a specific content or topic. Content takes precedence.
      const isStandaloneChannel = params.get('isStandaloneChannel');
      if (isStandaloneChannel === 'true') {
        this.$store.commit('setIsStandaloneChannel');
      }
      const contentId = params.get('contentId');
      if (contentId) {
        this.$router.push(`/c/${contentId}`);
        return;
      }
      const topicId = params.get('topicId');
      if (topicId) {
        this.$router.push(`/t/${topicId}`);
        return;
      }
      const test = params.get('test');
      if (test === 'true') {
        this.$router.push('/test');
      }
    },
  },
};
</script>

<style lang="scss">
@import '@/index.scss';

html {
  height: 100%;
}
/* Always show the vertical scrollbar */
body {
  overflow-y: scroll;
  min-height: 100vh;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}
</style>
