<template>

  <div class="channels-page">
    <Header class="header" @click-logo="goToTop">
      <b-navbar-brand>
        Endless Discovery
      </b-navbar-brand>

      <template v-slot:right>
        <b-nav-text>
          <strong class="text-muted">Exploration ideas</strong>
        </b-nav-text>

        <div class="main-buttons">
          <b-button
            v-for="term in searchTerms"
            :key="term"
            pill
            variant="primary"
            @click="goToTerm(term)"
          >
            {{ term }}
          </b-button>
        </div>

        <b-button pill @click="goToSearch">
          <b-icon-search />
          Search
        </b-button>
      </template>
    </Header>

    <div class="main">
      <b-container class="channels pb-5 pt-3">
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

    <div class="footer">
      <b-container>
        <b-row>
          <b-col cols="7">
            <h3 class="text-muted">
              <strong>The Endless Key Discovery</strong> — content to help you do
              your homework and discover curiosity you didn't even know you had,
              even without internet.
            </h3>
          </b-col>
          <b-col cols="1" />
          <b-col>
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
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import _ from 'underscore';
  import { PageNames } from '../constants';
  import { getBigThumbnail } from '../customApps';

  export default {
    name: 'ChannelsPage',
    mixins: [commonCoreStrings],
    props: {
      columns: {
        type: Number,
        default: 3,
      },
    },
    data() {
      return {
        searchTerms: ['STEM', 'Games', 'Fitness', 'Cooking', 'Arts'],
      };
    },
    computed: {
      ...mapState('topicsRoot', { channels: 'rootNodes' }),
      // FIXME: filter this correctly, right now we're showing the first 6
      // items with thumbnail and the rest without
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

  .footer {
    padding: 5rem 0;
    background: linear-gradient(to bottom, rgba($black, 0.075) 0, rgba($black, 0) 5px) $gray-300;
  }

  .header {
    background: white;
  }

  .channels-page {
    padding-top: $navbar-height;
  }

  ::v-deep .main-buttons button {
    margin-right: $spacer;
  }

  ::v-deep .main-buttons {
    margin-left: $spacer;
  }

</style>
