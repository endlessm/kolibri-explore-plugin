<template>
  <div id="app" class="d-flex flex-column h-100">
    <!-- Wrapper needed to fix flexbox footer positioning on IE11 -->
    <div class="flex-shrink-0">
      <router-view>
        <Header />
      </router-view>
    </div>
    <Footer />
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
  methods: {
    ...mapMutations(['setContentNavigation', 'setSectionNavigation', 'setHomeNavigation']),
    gotChannelInformation(data) {
      this.$store.commit('setChannelInformation', data);
      this.$store.commit('setHomeNavigation');
      const uri = window.location.search.substring(1);
      const params = new URLSearchParams(uri);
      const topicId = params.get('topicId');
      if (topicId) {
        this.$router.push(`/${topicId}`);
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
};
</script>

<style lang="scss">
@import '@/styles.scss';

html,
body {
  height: 100%;
}

/* Always show the vertical scrollbar */
body {
  overflow-y: scroll;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
