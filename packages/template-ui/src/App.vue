<template>
  <div id="app" class="d-flex flex-column h-100">
    <!-- Wrapper needed to fix flexbox footer positioning on IE11 -->
    <div class="flex-fill flex-shrink-0">
      <ChannelNavBar />
      <router-view>
        <ChannelHeader />
      </router-view>
    </div>
    <ChannelFooter />
  </div>
</template>

<script>

export default {
  name: 'App',
  created() {
    window.kolibri.themeRenderer({
        appBarColor: null,
        textColor: null,
        backdropColor: null,
        backgroundColor: null,
    });
    console.debug(`Running under Kolibri version: ${window.kolibri.version}`);

    // FIXME add API to query the channel information
    const channel = {
      id: 123,
      title: 'My title',
      description: 'My description',
    };
    this.$store.commit('setChannelInformation', { channel });

    return window.kolibri.getContentByFilter({ parent: 'self' })
      .then((page) => {
        // FIXME query by kind 'topic' instead of filtering results:
        const mainSections = page.results.filter((n) => n.kind === 'topic');
        this.$store.commit('setMainSections', { mainSections });
        this.handleRedirects();
      });
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
        return;
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
