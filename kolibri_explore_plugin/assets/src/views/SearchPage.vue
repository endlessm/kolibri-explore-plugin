<template>

  <div class="d-flex flex-column h-100 search-page">
    <Header class="header" @click-logo="goBack">
      <b-navbar-brand href="#/topics">
        Back to Discovery
      </b-navbar-brand>
    </Header>

    <div class="main">
      <SearchBar
        v-model="query"
        :debounce="800"
        :loading="loading"
        @clear-input="clearInput"
      />
      <b-container class="pb-5 pt-3">
        <h5 v-if="!hasResults && !loading" class="text-center">
          Type something to search for channels and content.
        </h5>
        <div v-if="resultChannels">
          <h4 class="text-muted">
            Channels
          </h4>
          <ChannelCardGroup
            :rows="resultChannels"
            :hasThumbnail="false"
            :columns="3"
            @card-click="goToChannel"
          />
        </div>
      </b-container>

      <div v-if="resultCards">
        <div v-for="(nodes, channelId) in resultCards" :key="channelId">
          <CardGrid
            id="root"
            :nodes="nodes"
            :mediaQuality="mediaQuality"
            :cardColumns="cardColumns"
          >
            <div>
              <hr>
              <b-row>
                <b-col>
                  <h4 class="text-muted">
                    {{ channelTitle(channelId) }}
                  </h4>
                </b-col>
                <b-col class="text-primary text-right">
                  <b-link @click="goToChannel(channelId)">
                    go to channel <b-icon-arrow-right />
                  </b-link>
                </b-col>
              </b-row>
            </div>
          </CardGrid>
        </div>
      </div>
    </div>

    <div v-if="recommended" class="flex-shrink-0 mt-auto recommended">
      <b-container v-if="recommended" class="pb-5 pt-3">
        <h4 class="text-muted">
          Featured Channels
        </h4>
        <ChannelCardGroup
          :rows="recommended"
          :hasThumbnail="true"
          :columns="3"
          @card-click="goToChannel"
        />
      </b-container>
    </div>
  </div>

</template>


<script>

  import _ from 'underscore';
  import { mapMutations, mapState } from 'vuex';
  import { utils, constants } from 'eos-components';
  import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';

  import { PageNames } from '../constants';
  import { searchChannels } from '../modules/topicsRoot/handlers';

  export default {
    name: 'SearchPage',
    data() {
      return {
        query: '',
        cardColumns: {
          cols: 6,
          md: 3,
        },
        mediaQuality: constants.MediaQuality.REGULAR,
      };
    },
    computed: {
      ...mapState('topicsRoot', { searchResult: 'searchResult', channels: 'rootNodes' }),
      ...mapState({
        loading: state => state.core.loading,
      }),
      recommended() {
        if (!this.channels || !this.channels.length) {
          return null;
        }

        // FIXME: Placeholder recommended channels, randomly selected
        const channels = [];
        const allChannels = [...this.channels];
        while (channels.length < 3 && allChannels.length > 0) {
          const index = _.random(0, allChannels.length - 1);
          const [channel] = allChannels.splice(index, 1);
          channels.push(channel);
        }
        return [channels];
      },
      cleanedQuery() {
        return this.query.trim();
      },
      hasResults() {
        return this.searchResult.channels || this.searchResult.result;
      },
      resultChannels() {
        const { channels } = this.searchResult;
        if (!channels || !channels.length) {
          return null;
        }

        return _.chunk(this.searchResult.channels, 3);
      },
      resultCards() {
        const { results } = this.searchResult;
        if (!results || !results.length) {
          return null;
        }

        // Add tags to nodes
        const nodes = utils.parseNodes(results);

        // Add thumbnails and links to nodes
        nodes.forEach(node => {
          const thumbnailUrl = getContentNodeThumbnail(node);
          node.thumbnail = thumbnailUrl;
          const base = `/topics/${node.channel_id}`;
          if (node.kind === 'topic') {
            node.nodeUrl = `${base}/t/${node.id}`;
          } else {
            node.nodeUrl = `${base}/c/${node.id}`;
          }
        });

        // Group by channel
        const grouped = _.groupBy(nodes, n => n.channel_id);

        return grouped;
      },
    },
    watch: {
      cleanedQuery() {
        this.search(this.cleanedQuery);
      },
    },
    mounted() {
      this.setSearchResult({});
    },
    methods: {
      ...mapMutations({
        setSearchResult: 'topicsRoot/SET_SEARCH_RESULT',
      }),
      goBack() {
        this.$router.push({
          name: PageNames.TOPICS_ROOT,
        });
      },
      goToChannel(channelId) {
        this.$router.push({
          name: PageNames.TOPICS_CHANNEL,
          params: { channel_id: channelId },
        });
      },
      search(query) {
        if (!query) {
          this.setSearchResult({});
          return;
        }

        searchChannels(this.$store, { search: query });
      },
      clearInput() {
        this.query = '';
      },
      channelTitle(channelId) {
        const channel = this.searchResult.channels.find(c => c.id === channelId);
        return channel ? channel.title : channelId;
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

  .search-page {
    padding-top: $navbar-height;
  }

  .recommended {
    background-color: $body-bg;
  }

</style>
