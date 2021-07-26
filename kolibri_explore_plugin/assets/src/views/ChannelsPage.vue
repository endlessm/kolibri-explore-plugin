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
          :buttons="Array.from(searchTerms.keys())"
          @click="goToTerm"
        />
        <SearchButton @click="goToSearch" />
      </template>
    </Header>

    <b-container class="mb-2 mt-4">
      <h5 class="mt-2 text-muted">
        Popular Content Suggestions
      </h5>
    </b-container>

    <template v-if="core.loading">
      <CarouselPlaceholder v-if="hasCarousel" />
    </template>

    <template v-else>
      <Carousel class="pt-3" :nodes="carouselNodes" :showChannelIcon="true" />
    </template>

    <div class="flex-fill main">

      <b-container class="mb-1 mt-4">
        <h5 class="mt-2 text-muted">
          Discover the channels
        </h5>
      </b-container>

      <template v-if="core.loading">
        <CardGridPlaceholder />
      </template>

      <template v-else>
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
      </template>

    </div>

    <DiscoveryFooter />

  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import _ from 'underscore';
  import { responsiveMixin, utils } from 'eos-components';
  import { PageNames, searchTerms } from '../constants';
  import { getBigThumbnail, ThumbApps } from '../customApps';

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

        // Order the channels with thumbnail as in the ThumbApps array:
        withThumbnail = _.sortBy(withThumbnail, n => ThumbApps.indexOf(utils.getSlug(n.title)));

        // Split the channels in rows:
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
        const query = searchTerms.get(term) || term;
        this.$router.push({
          name: PageNames.SEARCH,
          params: { query },
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
    background-color: $white;
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
