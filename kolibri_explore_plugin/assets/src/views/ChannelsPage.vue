<template>

  <div class="channels-page d-flex flex-column min-vh-100">
    <Header class="header" @click-logo="goToTop">
      <b-nav-text class="btn pl-0">
        Endless Discovery
      </b-nav-text>

      <template v-slot:right>
        <div class="main-buttons mr-3 mt-1">
          <b-button
            v-for="term in searchTerms"
            :key="term"
            pill
            size="sm"
            variant="primary"
            class="ml-2"
            @click="goToTerm(term)"
          >
            {{ term }}
          </b-button>
        </div>

        <b-button pill variant="outline-dark" @click="goToSearch">
          <b-icon-search />
          Search
        </b-button>
      </template>
    </Header>

    <div class="flex-fill main">
      <div v-if="core.loading" class="placeholder">
        <CarouselPlaceholder />
        <CardGridPlaceholder :elements="columns" />
      </div>


      <!-- Carousel -->
      <Carousel class="pt-3" :nodes="carouselNodes" />

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

    <Footer class="flex-shrink-0 mt-auto">
      <template #left>
        <h3 class="text-muted">
          <strong>The Endless Key Discovery</strong> — content to help you do
          your homework and discover curiosity you didn't even know you had,
          even without internet.
        </h3>
      </template>
      <template #right>
        <p class="text-muted">
          The Endless Key initiative is brought to you by the Endless OS
          Foundation in partnership with Common Sense and Learning
          Equality
        </p>
        <b-button
          pill
          variant="outline-secondary"
          target="_blank"
          href="https://www.endlessos.org/key"
        >
          Learn more <b-icon-chevron-right />
        </b-button>
      </template>
    </Footer>

  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import _ from 'underscore';
  import { responsiveMixin } from 'eos-components';
  import { PageNames } from '../constants';
  import { getBigThumbnail } from '../customApps';

  export default {
    name: 'ChannelsPage',
    mixins: [commonCoreStrings, responsiveMixin],
    data() {
      return {
        searchTerms: ['STEM', 'Games', 'Fitness', 'Cooking', 'Arts'],
      };
    },
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

  .header {
    background: white;
  }

  .channels-page {
    padding-top: $navbar-height;
  }

  .placeholder {
    margin-top: $card-deck-margin * 2;
  }

</style>
