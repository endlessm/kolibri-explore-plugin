<template>

  <div class="d-flex flex-column h-100 search-page">
    <Header class="header" @click-logo="goBack">
      <b-navbar-brand href="#/topics">
        Back to Discovery
      </b-navbar-brand>
    </Header>

    <div class="h-100 main">
      <SearchBar
        v-model="query"
        :debounce="800"
        :loading="loading"
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

  import { Header, ChannelCardGroup, SearchBar } from 'eos-components';
  import { PageNames } from '../constants';

  import { searchChannels } from '../modules/topicsRoot/handlers';

  export default {
    name: 'SearchPage',
    components: {
      ChannelCardGroup,
      Header,
      SearchBar,
    },
    data() {
      return {
        query: '',
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

        // TODO: show loading
        searchChannels(this.$store, { search: query });
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
