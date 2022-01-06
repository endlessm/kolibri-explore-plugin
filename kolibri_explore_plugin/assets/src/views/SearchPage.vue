<template>

  <div class="d-flex flex-column min-vh-100 search-page">
    <AboutModal id="about-modal" />
    <DiscoveryNavBar />
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
            <h5>
              You can try a different search, maybe use fewer words, or try one
              of the topic suggestions below.
            </h5>
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
        <div v-if="resultChannels.length">
          <h4 class="text-muted">
            {{ resultChannels.length }} channels related to "{{ cleanedQuery }}"
          </h4>
          <ChannelCardGroup
            variant="smallCard"
            :rows="resultChannelsColumns"
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
          :columns="columns"
          @card-click="goToChannel"
        />
      </b-container>
    </div>

  </div>

</template>


<script>

  import _ from 'underscore';
  import { mapMutations, mapState } from 'vuex';
  import { utils, constants, responsiveMixin } from 'eos-components';
  import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';

  import { PageNames, searchTerms } from '../constants';
  import { searchChannels } from '../modules/topicsRoot/handlers';

  import DiscoveryNavBar from '../components/DiscoveryNavBar';
  import AboutModal from '../components/AboutModal';

  const kinds = Object.keys(constants.MediaTypeVerbs);

  export default {
    name: 'SearchPage',
    components: { AboutModal, DiscoveryNavBar },
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
        return (
          !this.isEmpty &&
          !this.isLoading &&
          !this.resultCards.length &&
          !this.resultChannels.length
        );
      },
      recommended() {
        if (!this.channels || !this.channels.length) {
          return null;
        }

        // FIXME: Placeholder recommended channels, randomly selected
        const channels = [];
        const allChannels = this.channels.filter(c => c.bigThumbnail !== null);
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
        return kinds
          .map(k => _.get(this.searchResult, [k, 'channels'], []))
          .reduce((accumulator, value) => {
            return _.uniq([...accumulator, ...value], false, 'id');
          }, []);
      },

      resultChannelsColumns() {
        return _.chunk(this.resultChannels, this.columns);
      },
      resultCards() {
        const groups = kinds
          .map(k => {
            const results = _.get(this.searchResult, [k, 'results'], []);
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

            return [k, nodes];
          })
          // Remove empty groups
          .filter(([, nodes]) => nodes.length > 0);

        // Sort by number of results
        return _.sortBy(groups, ([, nodes]) => nodes.length).reverse();
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

        kinds.forEach(k => searchChannels(this.$store, query, k));
      },
      clearInput() {
        this.query = '';
      },
      groupVerb(kind) {
        return constants.MediaTypeVerbs[kind === 'topic' ? 'bundle' : kind];
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .main {
    background-color: $gray-300;
  }

  .discovery-navbar {
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
