<template>

  <div class="d-flex flex-column min-vh-100 search-page">
    <DiscoveryNavBar />

    <div
      class="flex-fill"
    >

      <EkSearchBar
        v-model="query"
        class="search-row"
        :progress="progress"
        :loading="isLoading"
        @clear-input="clearInput"
      />
      <div v-if="isEmpty" class="mt-5">
        <AlphabeticalChannelsList />
      </div>

      <template v-else>
        <b-container>
          <b-row alignH="between">
            <b-col>
              <b-form-checkbox v-model="hideUnavailable" name="check-hide-unavailable" switch>
                {{ $tr('hideUnavailableLabel') }}
              </b-form-checkbox>
            </b-col>
            <b-col class="text-right">
              <EkKeywords :words="keywords" @click="removeKeyword" />
            </b-col>
          </b-row>
        </b-container>

        <template v-if="resultCards">
          <div v-for="[kind, nodes] in resultCards" :key="kind">
            <EkCardGrid
              id="root"
              variant="collapsible"
              :itemsPerPage="4"
              :nodes="nodes"
              :mediaQuality="mediaQuality"
              :cardColumns="cardColumns"
              @nodeUpdated="onNodeUpdated"
            >
              <div>
                <h4 class="text-muted">
                  <span class="font-weight-normal">
                    {{ $tr('countedResults', {
                      count: nodes.length,
                      term: cleanedQuery,
                      action: groupVerb(kind)
                    }) }}
                  </span>
                </h4>
              </div>
            </EkCardGrid>
            <hr>
          </div>
        </template>

        <template v-if="isLoading" class="placeholder">
          <EkCardGridPlaceholder />
        </template>

        <b-container class="pb-5">
          <template v-if="!isLoading">
            <div v-if="isNoResults" class="empty mb-4 mt-5 w-50">
              <h1>{{ $tr('noResultsHeading') }}</h1>
              <h5>
                {{ $tr('noResultsBody') }}
              </h5>
            </div>
          </template>
        </b-container>

        <b-container v-if="resultChannels.length" class="pb-5 pt-3">
          <h4 class="text-muted">
            {{ $tr('countedChannels', {
              count: resultChannels.length,
              term: cleanedQuery
            }) }}
          </h4>
          <EkChannelCardGroup
            variant="smallCard"
            :rows="resultChannelsColumns"
            :columns="columns"
            @card-click="goToChannel"
          />
        </b-container>

        <div v-if="recommended && isNoResults" class="flex-shrink-0 pt-5 recommended">
          <b-container v-if="recommended" class="pb-5 pt-3">
            <h3 class="text-muted">
              {{ $tr('noResultsExplore') }}
            </h3>
            <h5>
              <b-link @click="clearInput">
                {{ $tr('noResultsSeeAllChannels') }} <b-icon-arrow-right />
              </b-link>
            </h5>
            <EkChannelCardGroup
              :rows="recommended"
              :columns="columns"
              @card-click="goToChannel"
            />
          </b-container>
        </div>

      </template>

      <AboutFooter />

    </div>

  </div>

</template>


<script>

  import _ from 'lodash';
  import { mapMutations, mapState } from 'vuex';
  import { utils, constants, responsiveMixin } from 'ek-components';

  import { ContentNodeResource } from '../apiResources';
  import { searchChannelsOnce } from '../modules/topicsRoot/handlers';
  import navigationMixin from '../mixins/navigationMixin';

  import AlphabeticalChannelsList from '../components/AlphabeticalChannelsList';
  import DiscoveryNavBar from '../components/DiscoveryNavBar';
  import AboutFooter from '../components/AboutFooter';

  const kinds = Object.keys(constants.MediaTypeVerbs);
  const DEFAULT_HIDE_UNAVAILABLE = false;

  export default {
    name: 'SearchPage',
    metaInfo() {
      return {
        title: this.$tr('documentTitle'),
      };
    },
    components: { AlphabeticalChannelsList, DiscoveryNavBar, AboutFooter },
    mixins: [navigationMixin, responsiveMixin],
    data() {
      return {
        query: '',
        cardColumns: {
          cols: 6,
          md: 4,
          lg: 3,
        },
        mediaQuality: constants.MediaQuality.REGULAR,
        progress: 100,
        resultKinds: [],
        hideUnavailable: DEFAULT_HIDE_UNAVAILABLE,
      };
    },
    computed: {
      ...mapState('topicsRoot', { searchResult: 'searchResult', channels: 'rootNodes' }),
      ...mapState({
        searchTerm: 'searchTerm',
      }),
      isEmpty() {
        return !this.query.trim();
      },
      isLoading() {
        return this.progress < 100 && !this.isEmpty;
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
        return this.resultKinds
          .map(k => _.get(this.searchResult, [k, 'channels'], []))
          .reduce((accumulator, value) => {
            return _.uniq([...accumulator, ...value], false, 'id');
          }, []);
      },

      resultChannelsColumns() {
        return _.chunk(this.resultChannels, this.columns);
      },
      resultCards() {
        const groups = this.resultKinds
          .map(k => {
            const results = _.get(this.searchResult, [k, 'results'], []);
            const nodes = results
              // Tweak the nodes with EK customizations:
              .map(utils.addStructuredTag)
              .map(utils.updateExploreNodeUrl);

            return [k, nodes];
          })
          // Remove empty groups
          .filter(([, nodes]) => nodes.length > 0);

        return groups;
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
      keywords() {
        return this.cleanedQuery.split(/\s+/);
      },
    },
    watch: {
      cleanedQuery() {
        this.setSearchTerm(this.query);
        this.search(this.cleanedQuery);
      },
      searchTerm() {
        this.query = this.searchTerm || '';
      },
      hideUnavailable() {
        this.setSearchTerm(this.query);
        this.search(this.cleanedQuery);
      },
    },
    created() {
      this.query = this.searchTerm || '';
    },
    deactivated() {
      // Clear progress and ignore any incoming search promises:
      this.progress = 100;
      this.$store.commit('topicsRoot/RESET_LAST_SEARCH_PROMISES');
    },
    methods: {
      ...mapMutations({
        setSearchResult: 'topicsRoot/SET_SEARCH_RESULT',
        setSearchTerm: 'SET_SEARCH_TERM',
      }),
      search(query) {
        this.setSearchResult({});
        this.resultKinds = [];
        if (!query) {
          return;
        }

        this.progress = 0;
        kinds.forEach(k => {
          searchChannelsOnce(this.$store, query, k, !this.hideUnavailable).then(() => {
            this.resultKinds.push(k);
            this.progress += 100 / kinds.length;
          });
        });
      },
      clearInput() {
        this.query = '';
      },
      groupVerb(kind) {
        return constants.mediaTypeVerb(kind === 'topic' ? 'bundle' : kind);
      },
      removeKeyword(keyword) {
        const words = this.keywords.filter(k => k !== keyword);
        this.query = words.join(' ');
        this.$router.push({ params: { query: this.query } });
      },
      onNodeUpdated(nodeId) {
        ContentNodeResource.fetchModel({ id: nodeId }).then(newNode => {
          const index = this.searchResult[newNode.kind].results.findIndex(
            node => node.id === newNode.id
          );
          if (index === -1) {
            return;
          }

          // Add channel to new node, like the initial handler does:
          const oldNode = this.searchResult[newNode.kind].results[index];
          newNode.channel = oldNode.channel;

          // Update the results reactively:
          this.$set(this.searchResult[newNode.kind].results, index, newNode);
        });
      },
    },
    $trs: {
      documentTitle: 'Library',
      hideUnavailableLabel: 'Only downloaded items',
      countedResults:
        '{count} {count, plural, one {result} other {results}} for “{term}” to {action}',
      countedChannels:
        '{count} {count, plural, one {channel} other {channels}} related to “{term}”',
      noResultsHeading: {
        message: 'Sorry, we can’t find any content that matches your search.',
        context: 'Heading shown when a search produces no results',
      },
      noResultsBody: {
        message:
          'You can try a different search, maybe use fewer words, or try one of the topic suggestions below.',
        context: 'Suggestion shown when a search produces no results',
      },
      noResultsExplore: {
        message: 'Explore',
        context: 'Heading shown with content suggestions when a search produces no results',
      },
      noResultsSeeAllChannels: {
        message: 'See all channels',
        context: 'Link to more content shown when a search produces no results',
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .search-row {
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
