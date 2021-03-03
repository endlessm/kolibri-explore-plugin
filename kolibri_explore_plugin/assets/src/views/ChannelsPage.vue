<template>

  <div class="channels d-flex flex-column h-100">
    <PageHeader
      :title="coreString('channelsLabel')"
      class="visuallyhidden"
    />

    <Header @searchClick="filter" />

    <div class="channelsgrid">
      <ChannelCardGroupGrid
        v-if="filteredChannels.length"
        class="grid"
        :contents="filteredChannels"
        :genContentLink="genChannelLink"
      />
    </div>

    <Footer />
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import { PageNames } from '../constants';
  import Footer from '../components/Footer';
  import Header from '../components/Header';
  import PageHeader from './PageHeader';
  import ChannelCardGroupGrid from './ChannelCardGroupGrid';

  export default {
    name: 'ChannelsPage',
    metaInfo() {
      return {
        title: this.$tr('documentTitle'),
      };
    },
    components: {
      PageHeader,
      ChannelCardGroupGrid,
      Footer,
      Header,
    },
    mixins: [commonCoreStrings],
    data() {
      return {
        searchQuery: '',
      };
    },
    computed: {
      ...mapState('topicsRoot', { channels: 'rootNodes' }),
      filteredChannels() {
        const re = new RegExp(`.*${this.searchQuery}.*`, 'i');
        return this.channels.filter(c => c.title.match(re));
      },
    },
    methods: {
      genChannelLink(channel_id) {
        return {
          name: PageNames.TOPICS_CHANNEL,
          params: { channel_id },
        };
      },
      filter(searchQuery) {
        this.searchQuery = searchQuery;
      },
    },
    $trs: {
      documentTitle: 'All channels',
    },
  };

</script>


<style lang="scss" scoped>

  .channels {
    width: 100%;
    min-height: 100vh;
    padding: 20px;
    color: white;
    background-color: #3a3a3a;

    .channelsgrid {
      padding-top: 40px;
      clear: both;
    }
  }

</style>
