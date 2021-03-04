<template>

  <div class="channels d-flex flex-column h-100">
    <PageHeader
      :title="coreString('channelsLabel')"
      class="visuallyhidden"
    />

    <Header @searchClick="filter" />

    <Carousel />

    <ContentProvidersRow />
    <TagRow label="Sports" />
    <TagRow label="Nature" />
    <TagRow label="Health" />
    <TagRow label="Art" />
    <TagRow label="DIY" />

    <Footer />
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import { PageNames } from '../constants';
  import Carousel from '../components/Carousel';
  import ContentProvidersRow from '../components/ContentProvidersRow';
  import Footer from '../components/Footer';
  import Header from '../components/Header';
  import TagRow from '../components/TagRow';
  import PageHeader from './PageHeader';

  export default {
    name: 'ChannelsPage',
    metaInfo() {
      return {
        title: this.$tr('documentTitle'),
      };
    },
    components: {
      PageHeader,
      Carousel,
      ContentProvidersRow,
      Footer,
      Header,
      TagRow,
    },
    mixins: [commonCoreStrings],
    data() {
      return {
        searchQuery: '',
      };
    },
    computed: {
      ...mapState('topicsRoot', { channels: 'rootNodes' }),
      /* eslint-disable kolibri/vue-no-unused-properties */
      filteredChannels() {
        const re = new RegExp(`.*${this.searchQuery}.*`, 'i');
        return this.channels.filter(c => c.title.match(re));
      },
    },
    methods: {
      /* eslint-disable kolibri/vue-no-unused-methods */
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
