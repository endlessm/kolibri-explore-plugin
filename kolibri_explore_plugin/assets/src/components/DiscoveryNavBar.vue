<template>

  <EkNavBar class="discovery-navbar">
    <img class="logo ml-3 mr-5" :src="logo" @click="onLogoClick">
    <b-button-group class="mx-auto">
      <b-nav-text
        v-if="showDiscoveryTab"
        class="btn discovery-tab py-3 rounded-0 text-primary"
        :class="{ active: currentIsChannels() }"
        @click="goToChannels"
      >
        <ViewDashboardOutlineIcon />
        <!-- We want the text below in a line by itself,
         as it affects the spacing around it. -->
        {{ exploreString('discoveryLabel') }}
      </b-nav-text>
      <b-nav-text
        class="btn discovery-tab py-3 rounded-0 text-primary"
        :class="{ active: currentIsSearch() }"
        @click="goToSearch"
      >
        <MagnifyIcon />
        <!-- We want the text below in a line by itself,
         as it affects the spacing around it. -->
        {{ exploreString('libraryLabel') }}
      </b-nav-text>
    </b-button-group>
    <b-navbar-nav>
      <b-button
        v-if="showStoreButtons"
        class="align-self-center"
        variant="endless-orange"
        size="sm"
        pill
        @click="toBottom"
      >
        <!-- We want the text below in a line by itself,
         as it affects the spacing around it. -->
        <!-- TODO: Truncate on smaller resolutions -->
        <span class="d-none d-sm-inline">
          {{ $tr('downloadLabel') }}
        </span>
        <span class="d-inline d-sm-none">
          {{ $tr('downloadLabelShort') }}
        </span>
        <ArrowDownIcon />
      </b-button>
      <b-nav-item
        v-if="showFeedbackButton"
        class="d-block pr-0"
        :href="feedbackUrl"
        target="_blank"
        :disabled="isOffline"
      >
        <span class="d-inline"><MessageReplyTextOutlineIcon /></span>
        <span class="d-none d-sm-inline">
          <!-- We want the text below in a line by itself,
           as it affects the spacing around it. -->
          {{ $tr('feedbackLabel') }}
        </span>
      </b-nav-item>
    </b-navbar-nav>
  </EkNavBar>

</template>


<script>

  import { currentLanguage, languageIdToCode } from 'kolibri.utils.i18n';
  import ViewDashboardOutlineIcon from 'vue-material-design-icons/ViewDashboardOutline.vue';
  import MagnifyIcon from 'vue-material-design-icons/Magnify.vue';
  import MessageReplyTextOutlineIcon from 'vue-material-design-icons/MessageReplyTextOutline.vue';
  import ArrowDownIcon from 'vue-material-design-icons/ArrowDown.vue';

  import plugin_data from 'plugin_data';

  import { mapMutations } from 'vuex';
  import { assets } from 'ek-components';
  import commonExploreStrings from '../views/commonExploreStrings';
  import isOfflineMixin from '../mixins/isOfflineMixin';
  import { PageNames } from '../constants';

  export default {
    name: 'DiscoveryNavBar',
    components: {
      ViewDashboardOutlineIcon,
      MagnifyIcon,
      MessageReplyTextOutlineIcon,
      ArrowDownIcon,
    },
    mixins: [commonExploreStrings, isOfflineMixin],
    computed: {
      logo() {
        return assets.EndlessLogo;
      },
      feedbackUrl() {
        switch (languageIdToCode(currentLanguage)) {
          case 'es':
            return plugin_data.feedbackUrlEs;
          default:
            return plugin_data.feedbackUrl;
        }
      },
      showFeedbackButton() {
        return plugin_data.feedbackUrl != '';
      },
      showDiscoveryTab() {
        return !plugin_data.hideDiscoveryTab;
      },
      showStoreButtons() {
        return !!plugin_data.androidApplicationId && !!plugin_data.windowsApplicationId;
      },
    },
    methods: {
      ...mapMutations({
        setSearchResult: 'topicsRoot/SET_SEARCH_RESULT',
        setSearchTerm: 'SET_SEARCH_TERM',
      }),
      goToChannels() {
        this.$router.push({
          name: PageNames.TOPICS_ROOT,
        });
      },
      goToSearch() {
        // Cleaning previous search:
        this.setSearchResult({});
        this.setSearchTerm('');
        // Scroll to top. For some reason this is not needed when going to channels:
        window.scrollTo({ top: 0 });
        // Then go:
        this.$router.push({
          name: PageNames.SEARCH,
        });
      },
      toBottom() {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth',
        });
      },
      currentIsChannels() {
        return this.$route.name === PageNames.TOPICS_ROOT;
      },
      currentIsSearch() {
        return this.$route.name === PageNames.SEARCH;
      },
      onLogoClick(event) {
        if (event.ctrlKey) {
          this.$store.commit('topicsRoot/SET_SHOW_SIDE_NAV', true);
        }
      },
    },
    $trs: {
      feedbackLabel: 'Feedback',
      downloadLabel: 'Get Endless Key',
      downloadLabelShort: 'Get',
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .discovery-navbar {
    font-family: $btn-font-family;
    font-size: $btn-font-size;
    background: $gray-300;
    border-bottom: 1px solid $gray-400;
  }

  .discovery-tab {
    &.active {
      border-bottom: 2px solid $endless-orange;
    }
  }

  $logo-size: 50px;

  .logo {
    width: $logo-size;
  }

</style>
