<template>

  <div class="channels-page d-flex flex-column min-vh-100">
    <AboutModal id="about-modal" />
    <DiscoveryNavBar />

    <b-container class="mb-2 mt-4">
      <h5 class="mt-2 text-muted">
        Popular Content Suggestions
      </h5>
    </b-container>

    <template v-if="core.loading">
      <CarouselPlaceholder />
    </template>

    <template v-else>
      <b-container class="mb-2 mt-2">
        <ButtonsBar
          class="mr-3 mt-1"
          title="More Topics"
          :buttons="Array.from(searchTerms.keys())"
          @click="goToTerm"
        />
      </b-container>
      <Carousel class="pt-3" :nodes="carouselNodes" :showChannelIcon="true" />
    </template>

    <div class="flex-fill main">

      <b-container class="mb-1 mt-4">
        <h5 class="pt-2 text-muted">
          Discover the Channels
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

  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import _ from 'underscore';
  import { responsiveMixin } from 'eos-components';
  import { PageNames, searchTerms } from '../constants';
  import { RecommendedChannelIDs } from '../customApps';

  import DiscoveryNavBar from '../components/DiscoveryNavBar';
  import AboutModal from '../components/AboutModal';

  export default {
    name: 'ChannelsPage',
    components: { AboutModal, DiscoveryNavBar },
    mixins: [commonCoreStrings, responsiveMixin],
    computed: {
      ...mapState('topicsRoot', { channels: 'rootNodes', carouselNodes: 'carouselNodes' }),
      ...mapState(['core']),
      rows() {
        let withThumbnail = [];
        let withoutThumbnail = [];

        this.channels.forEach(channel => {
          if (RecommendedChannelIDs.includes(channel.id)) {
            withThumbnail.push(channel);
          } else {
            withoutThumbnail.push(channel);
          }
        });

        // Order the channels with thumbnail as in the ThumbApps array:
        withThumbnail = _.sortBy(withThumbnail, n => RecommendedChannelIDs.indexOf(n.id));

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
      // FIXME use this in https://phabricator.endlessm.com/T32922
      // goToTop() {
      //   window.scrollTo(0, 0);
      // },
      goToTerm(term) {
        const query = searchTerms.get(term) || term;
        this.$router.push({
          name: PageNames.SEARCH,
          params: { query },
        });
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .main {
    background-color: $white;
  }

  .discovery-navbar {
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
