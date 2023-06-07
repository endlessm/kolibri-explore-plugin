<template>
  <div v-if="kolibriApiReady" id="app" class="d-flex flex-column h-100">
    <EkBackToTop />
    <!-- Wrapper needed to fix flexbox footer positioning on IE11 -->
    <div class="flex-fill flex-shrink-0">
      <keep-alive include="Search,Home">
        <router-view />
      </keep-alive>
    </div>
    <ChannelFooter v-if="showFooter" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import mockKolibriApi from './mockKolibriApi';

const CHECK_DELAY = 100;

export default {
  name: 'App',
  data() {
    return {
      checkIntervalId: null,
      kolibriApiReady: false,
    };
  },
  computed: {
    ...mapState(['hasFilters', 'hasFlatGrid', 'showFooter']),
  },
  created() {
    this.checkIntervalId = setInterval(this.checkKolibriApiReady, CHECK_DELAY);
  },
  methods: {
    checkKolibriApiReady() {

      // Use a mock of Kolibri API when showing the test page:
      if (this.$router.history.current.name === 'Test') {
        window.kolibri = mockKolibriApi;
      }

      if (window.kolibri) {
        clearInterval(this.checkIntervalId);
        this.onKolibriApiReady().then(() => {
          this.checkIntervalId = null;
          this.kolibriApiReady = true;
        });
      }
    },
    onKolibriApiReady() {
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
        this.$router.replace(`/c/${contentId}`);
        return;
      }
      const topicId = params.get('topicId');
      if (topicId) {
        this.$router.replace(`/t/${topicId}`);
        return;
      }
      const test = params.get('test');
      if (test === 'true') {
        this.$router.replace('/test');
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
body {
  overflow-y: $app-body-overflow;
  min-height: 100vh;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}
</style>
