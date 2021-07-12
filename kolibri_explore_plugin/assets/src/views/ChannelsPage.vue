<template>

  <div class="channels-page d-flex flex-column min-vh-100">
    <Header class="discovery-header" @click-logo="goToTop">
      <b-nav-text class="btn d-md-block d-none pl-0">
        Endless Discovery
      </b-nav-text>

      <template v-slot:right>
        <ButtonsBar
          class="mr-3 mt-1"
          title="More Topics"
          :buttons="searchTerms"
          @click="goToTerm"
        />

        <b-button pill variant="outline-dark" @click="goToSearch">
          <b-icon-search />
          <span class="d-md-inline d-none">Search</span>
        </b-button>
      </template>
    </Header>

    <div class="flex-fill main">
      <div v-if="core.loading" class="placeholder">
        <CarouselPlaceholder />
        <CardGridPlaceholder :elements="columns" />
      </div>


      <!-- Carousel -->
      <Carousel class="pt-3" :nodes="carouselNodes" :showChannelIcon="true" />

      <b-container class="channels pb-5">
        <!-- Cards with thumbnail -->
        <ChannelCardGroup
          :rows="rows.withThumbnail"
          :getThumbnail="getBigThumbnail"
          :columns="columns"
          @card-click="goToChannel"
        />

        <!-- Cards without thumbnail -->
        <ChannelCardGroup
          :rows="rows.withoutThumbnail"
          :columns="columns"
          @card-click="goToChannel"
        />
      </b-container>
    </div>

    <DiscoveryFooter />

  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import _ from 'underscore';
  import { responsiveMixin } from 'eos-components';
  import { PageNames, searchTerms } from '../constants';
  import { getBigThumbnail } from '../customApps';

  import DiscoveryFooter from './DiscoveryFooter';

  export default {
    name: 'ChannelsPage',
    components: { DiscoveryFooter },
    mixins: [commonCoreStrings, responsiveMixin],
    computed: {
      ...mapState('topicsRoot', { channels: 'rootNodes', carouselNodes: 'carouselNodes' }),
      ...mapState(['core']),
      rows() {
        let withThumbnail = [];
        let withoutThumbnail = [];

        this.channels.forEach(channel => {
          const thumb = getBigThumbnail(channel);
          if (thumb) {
            withThumbnail.push(channel);
          } else {
            withoutThumbnail.push(channel);
          }
        });

        withThumbnail = _.chunk(withThumbnail, this.columns);
        withoutThumbnail = _.chunk(withoutThumbnail, this.columns);
        return { withThumbnail, withoutThumbnail };
      },
      columns() {
        if (this.xs) {
          return 1;
        }

        if (this.sm || this.md) {
          return 2;
        }

        return 3;
      },
      searchTerms() {
        return searchTerms;
      },
    },
    methods: {
      goToChannel(channelId) {
        this.$router.push({
          name: PageNames.TOPICS_CHANNEL,
          params: { channel_id: channelId },
        });
      },
      goToTop() {
        window.scrollTo(0, 0);
      },
      goToSearch() {
        this.$router.push({
          name: PageNames.SEARCH,
        });
      },
      goToTerm(term) {
        this.$router.push({
          name: PageNames.SEARCH,
          params: { query: term },
        });
      },
      getBigThumbnail(channel) {
        return getBigThumbnail(channel);
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .main {
    background-color: white;
  }

  .discovery-header {
    background: $gray-300;
    border-bottom: 1px solid $gray-400;
  }

  .channels-page {
    padding-top: $navbar-height;
  }

  .placeholder {
    margin-top: $card-deck-margin * 2;
  }

</style>
