<template>

  <div class="d-flex flex-column min-vh-100 search-page">
    <AboutModal id="about-modal" />
    <DiscoveryNavBar />

    <div
      class="flex-fill"
      :class="{ 'gray-background': !isEmpty, 'white-background': isEmpty }"
    >

      <SearchBar
        v-model="query"
        class="search-row"
        :debounce="800"
        :progress="progress"
        :loading="isLoading"
        @clear-input="clearInput"
      />
      <div v-if="isEmpty" class="mt-5">
        <AlphabeticalChannelsList />
      </div>

      <template v-else>
        <b-container>
          <Keywords :words="keywords" @click="removeKeyword" />
        </b-container>

        <template v-if="resultCards">
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
        </template>

        <template v-if="isLoading" class="placeholder">
          <CardGridPlaceholder />
        </template>

        <b-container class="pb-5">
          <template v-if="!isLoading">
            <div v-if="isNoResults" class="empty mb-4 mt-5 w-50">
              <h1>Sorry, we can’t find any content that matches your search.</h1>
              <h5>
                You can try a different search, maybe use fewer words, or try one
                of the topic suggestions below.
              </h5>
            </div>
          </template>
        </b-container>

        <b-container v-if="resultChannels.length" class="pb-5 pt-3">
          <h4 class="text-muted">
            {{ resultChannels.length }} channels related to "{{ cleanedQuery }}"
          </h4>
          <ChannelCardGroup
            variant="smallCard"
            :rows="resultChannelsColumns"
            :columns="columns"
            @card-click="goToChannel"
          />
        </b-container>

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

      </template>

    </div>

  </div>

</template>


<script>

  import _ from 'underscore';
  import { mapMutations, mapState } from 'vuex';
  import { utils, constants, responsiveMixin } from 'eos-components';
  import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';

  import { PageNames } from '../constants';
  import { searchChannels } from '../modules/topicsRoot/handlers';

  import AlphabeticalChannelsList from '../components/AlphabeticalChannelsList';
  import DiscoveryNavBar from '../components/DiscoveryNavBar';
  import AboutModal from '../components/AboutModal';

  const kinds = Object.keys(constants.MediaTypeVerbs);

  export default {
    name: 'SearchPage',
    components: { AboutModal, AlphabeticalChannelsList, DiscoveryNavBar },
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
        progress: 100,
        resultKinds: [],
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
    },
    methods: {
      ...mapMutations({
        setSearchResult: 'topicsRoot/SET_SEARCH_RESULT',
        setSearchTerm: 'SET_SEARCH_TERM',
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
        this.setSearchResult({});
        this.resultKinds = [];
        if (!query) {
          return;
        }

        this.progress = 0;
        kinds.forEach(k => {
          searchChannels(this.$store, query, k).then(() => {
            this.resultKinds.push(k);
            this.progress += 100 / kinds.length;
          });
        });
      },
      clearInput() {
        this.query = '';
      },
      groupVerb(kind) {
        return constants.MediaTypeVerbs[kind === 'topic' ? 'bundle' : kind];
      },
      removeKeyword(keyword) {
        const words = this.keywords.filter(k => k !== keyword);
        this.query = words.join(' ');
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .white-background {
    background-color: $white;
  }

  .gray-background {
    background-color: $gray-300;
  }

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
