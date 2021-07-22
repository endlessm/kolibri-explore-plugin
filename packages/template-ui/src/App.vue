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
import { mapMutations } from 'vuex';

// appMixin can be override
let appMixin = require('@/components/mixins/appMixin');

try {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  appMixin = require('@/overrides/components/mixins/appMixin');
} catch (e) {
  console.log('No appMixin override');
}

export default {
  name: 'App',
  mixins: [appMixin.default],
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
