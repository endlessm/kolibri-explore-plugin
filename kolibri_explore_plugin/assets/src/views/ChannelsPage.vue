<template>

  <div class="channels-page">
    <Header class="header" @click-logo="goToTop">
      <b-navbar-brand>
        Endless Discovery
      </b-navbar-brand>

      <template v-slot:right>
        <b-button pill>
          <b-icon-search />
          Search
        </b-button>
      </template>
    </Header>

    <div class="main">
      <b-container class="channels pb-5 pt-3">
        <!-- Cards without thumbnail -->
        <ChannelCardGroup
          :rows="rows.withThumbnail"
          :hasThumbnail="true"
          :columns="columns"
          @card-click="goToChannel"
        />

        <!-- Cards without thumbnail -->
        <ChannelCardGroup
          :rows="rows.withoutThumbnail"
          :hasThumbnail="false"
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
  import { ChannelCardGroup, Header } from 'eos-components';
  import _ from 'underscore';
  import { PageNames } from '../constants';

  export default {
    name: 'ChannelsPage',
    components: {
      ChannelCardGroup,
      Header,
    },
    mixins: [commonCoreStrings],
    props: {
      columns: {
        type: Number,
        default: 3,
      },
    },
    computed: {
      ...mapState('topicsRoot', { channels: 'rootNodes' }),
      // FIXME: filter this correctly, right now we're showing the first 6
      // items with thumbnail and the rest without
      rows() {
        let channels = this.channels.slice(0, 6);
        const withThumbnail = _.chunk(channels, this.columns);
        channels = this.channels.slice(6);
        const withoutThumbnail = _.chunk(channels, this.columns);

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

</style>
