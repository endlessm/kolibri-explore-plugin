<template>

  <div class="d-flex flex-column min-vh-100 search-page">
    <Header class="discovery-header" @click-logo="goBack">
      <b-nav-text class="btn pl-0" @click="goBack">
        <b-icon-chevron-left />
        <span class="text-primary">
          Endless Discovery
        </span>
      </b-nav-text>
    </Header>

    <div class="flex-fill main">
      <SearchBar
        v-model="query"
        :debounce="800"
        @clear-input="clearInput"
      />
      <b-container class="pb-5 pt-3">
        <div v-if="!hasResults && !isLoading" class="align-items-center d-flex">
          <h5 class="mb-0 text-muted">
            Topic Ideas
          </h5>
          <ButtonsBar
            class="ml-3"
            title="More Topics"
            :buttons="searchTerms"
            @click="goToTerm"
          />
        </div>
        <div v-if="isLoading" class="placeholder">
          <CardGridPlaceholder />
        </div>
        <div v-if="resultChannels">
          <h4 class="text-muted">
            Channels
          </h4>
          <ChannelCardGroup
            :rows="resultChannels"
            :hasThumbnail="false"
            :columns="columns"
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

    <div v-if="recommended && emptySearch" class="flex-shrink-0 pt-5 recommended">
      <b-container v-if="recommended" class="pb-5 pt-3">
        <h4 class="text-muted">
          Explore
        </h4>
        <ChannelCardGroup
          :rows="recommended"
          :getThumbnail="getBigThumbnail"
          :columns="columns"
          @card-click="goToChannel"
        />
      </b-container>
    </div>

    <DiscoveryFooter />
  </div>

</template>


<script>

  import _ from 'underscore';
  import { mapMutations, mapState } from 'vuex';
  import { utils, constants, responsiveMixin } from 'eos-components';
  import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';

  import { PageNames, searchTerms } from '../constants';
  import { searchChannels } from '../modules/topicsRoot/handlers';
  import { getBigThumbnail } from '../customApps';

  import DiscoveryFooter from './DiscoveryFooter';

  export default {
    name: 'SearchPage',
    components: { DiscoveryFooter },
    mixins: [responsiveMixin],
    data() {
      return {
        query: '',
        cardColumns: {
          cols: 6,
          md: 4,
          lg: 3,
        },
        mediaQuality: constants.MediaQuality.REGULAR,
      };
    },
    computed: {
      ...mapState('topicsRoot', { searchResult: 'searchResult', channels: 'rootNodes' }),
      ...mapState({
        loading: state => state.core.loading,
        searchTerm: 'searchTerm',
      }),
      isLoading() {
        return this.loading && !!this.query.trim();
      },
      emptySearch() {
        return !this.loading && !!this.query.trim() && !this.resultCards;
      },
      recommended() {
        if (!this.channels || !this.channels.length) {
          return null;
        }

        // FIXME: Placeholder recommended channels, randomly selected
        const channels = [];
        const allChannels = this.channels.filter(c => getBigThumbnail(c));
        while (channels.length < this.columns && allChannels.length > 0) {
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

        return _.chunk(this.searchResult.channels, this.columns);
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
    watch: {
      cleanedQuery() {
        this.search(this.cleanedQuery);
      },
    },
    mounted() {
      this.query = this.searchTerm || '';
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
      goToTerm(term) {
        this.query = term;
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
      getBigThumbnail(channel) {
        return getBigThumbnail(channel);
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .main {
    background-color: $gray-300;
  }

  .discovery-header {
    background: $gray-300;
    border-bottom: 1px solid $gray-400;
  }

  .search-page {
    padding-top: $navbar-height;
  }

  .recommended {
    background-color: $gray-400;
  }

</style>
