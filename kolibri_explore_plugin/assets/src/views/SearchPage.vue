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
        <div v-if="isLoading" class="placeholder">
          <CardGridPlaceholder />
        </div>
        <div v-else>
          <div v-if="isNoResults" class="empty mb-4 w-50">
            <h1>Sorry, we can’t find any content that matches your search.</h1>
            <h5>You can try to use fewer words or try one of the channel suggestions bellow.</h5>
          </div>
          <div v-if="isEmpty || isNoResults" class="align-items-center d-flex">
            <h5 v-if="isEmpty" class="mb-0 mr-3 text-muted">
              Topic Ideas
            </h5>
            <ButtonsBar
              title="More Topics"
              :buttons="Array.from(searchTerms.keys())"
              @click="goToTerm"
            />
          </div>
        </div>
      </b-container>

      <div v-if="resultCards">
        <div v-for="[kind, nodes] in resultCards" :key="kind">
          <CardGrid
            id="root"
            variant="collapsible"
            :itemsPerPage="4"
            :nodes="nodes"
            :mediaQuality="mediaQuality"
            :cardColumns="cardColumns"
          >
            <div>
              <h4 class="text-muted">
                <span class="font-weight-normal">
                  {{ nodes.length }} results for "{{ cleanedQuery }}"
                </span>
                to {{ groupVerb(kind) }}
              </h4>
            </div>
          </CardGrid>
          <hr>
        </div>
      </div>

      <b-container class="pb-5 pt-3">
        <div v-if="resultChannels">
          <h4 class="text-muted">
            {{ searchResult.channels.length }} channels related to "{{ cleanedQuery }}"
          </h4>
          <ChannelCardGroup
            variant="smallCard"
            :rows="resultChannels"
            :columns="columns"
            @card-click="goToChannel"
          />
        </div>
      </b-container>

    </div>

    <div v-if="recommended && isNoResults" class="flex-shrink-0 pt-5 recommended">
      <b-container v-if="recommended" class="pb-5 pt-3">
        <h3 class="text-muted">
          Explore
        </h3>
        <h5>
          <b-link @click="goBack">
            See all channels <b-icon-arrow-right />
          </b-link>
        </h5>
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
      isEmpty() {
        return !this.query.trim();
      },
      isLoading() {
        return this.loading && !this.isEmpty;
      },
      isNoResults() {
        return !this.isEmpty && !this.isLoading && !this.resultCards;
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

        // Group by content kind
        const grouped = _.groupBy(nodes, n => n.kind);
        // Order by number of results
        const sortedKeys = _.sortBy(Object.keys(grouped), k => grouped[k].length).reverse();
        const sortedValues = sortedKeys.map(k => grouped[k]);
        const zipped = _.zip(sortedKeys, sortedValues);
        return zipped;
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
        this.query = searchTerms.get(term) || term;
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
      groupVerb(kind) {
        return constants.MediaTypeVerbs[kind === 'topic' ? 'bundle' : kind];
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

  .empty h1 {
    color: $gray-500;
  }

  .empty h5 {
    color: $gray-600;
  }

</style>
