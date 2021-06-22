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
import { askChannelInformation } from 'kolibri-api';
import { mapMutations } from 'vuex';

let mockData;
if (process.env.VUE_APP_USE_MOCK_DATA === 'true') {
  const mockDataFilename = 'nodes';
  // eslint-disable-next-line global-require, import/no-dynamic-require
  mockData = require(`@/${mockDataFilename}.json`);
}

export default {
  name: 'App',
  watch: {
    $route(to) {
      // Watch the router "to" parameter, and set the navigation state accordingly.
      switch (to.name) {
        case 'Content':
          this.setContentNavigation({
            contentId: this.$route.params.contentId,
          });
          return;
        case 'Section':
          this.setSectionNavigation({
            topicId: this.$route.params.topicId,
          });
          return;
        case 'Home':
        case 'Search':
        default:
          this.setHomeNavigation();
      }
    },
  },
  created() {
    if (process.env.VUE_APP_USE_MOCK_DATA === 'true') {
      this.gotChannelInformation(mockData);
    } else {
      askChannelInformation(this.gotChannelInformation);
    }
  },
  methods: {
    ...mapMutations(['setContentNavigation', 'setSectionNavigation', 'setHomeNavigation']),
    gotChannelInformation(data) {
      this.$store.commit('setChannelInformation', data);
      this.$store.commit('setHomeNavigation');
      const uri = window.location.search.substring(1);
      const params = new URLSearchParams(uri);
      // Check if we need to navigate to a specific content or topic. Content takes precedence.
      const contentId = params.get('contentId');
      if (contentId) {
        this.$router.push(`/c/${contentId}`);
        return;
      }
      const topicId = params.get('topicId');
      if (topicId) {
        this.$router.push(`/t/${topicId}`);
      }
    },
  },
};
</script>

<style lang="scss">
@import '@/styles.scss';

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
