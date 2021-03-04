<template>

  <div class="channels d-flex flex-column h-100">
    <PageHeader
      :title="coreString('channelsLabel')"
      class="visuallyhidden"
    />

    <Header @searchClick="filter" />
    <b-container fluid>
      <Carousel />
    </b-container>

    <ContentProvidersRow />

    <div v-if="!loading">
      <TagRow
        v-for="tag in tags"
        :key="tag.name"
        :label="tag.name"
        :nodes="getNodes(tag)"
      />
    </div>

    <Footer />
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import { ContentNodeResource } from 'kolibri.resources';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import { PageNames } from '../constants';
  import Carousel from '../components/Carousel';
  import ContentProvidersRow from '../components/ContentProvidersRow';
  import Footer from '../components/Footer';
  import Header from '../components/Header';
  import TagRow from '../components/TagRow';
  import DemoData from '../chromeos-demo.json';
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
        nodes: {},
        loading: true,
      };
    },
    computed: {
      ...mapState('topicsRoot', { channels: 'rootNodes' }),
      /* eslint-disable kolibri/vue-no-unused-properties */
      filteredChannels() {
        const re = new RegExp(`.*${this.searchQuery}.*`, 'i');
        return this.channels.filter(c => c.title.match(re));
      },

      tags() {
        return DemoData.tags;
      },
    },
    mounted() {
      this.tags.forEach(t => {
        const nodes = t.nodes.map(n => {
          return ContentNodeResource.fetchModel({ id: n });
        });
        Promise.all(nodes)
          .then(ns => {
            ns.forEach(n => {
              this.nodes[n.id] = n;
            });
            this.loading = false;
          })
          .catch(error => {
            console.error(error.message);
            this.loading = false;
          });
      });
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
      getNodes(tag) {
        return tag.nodes.map(n => {
          return this.nodes[n] || { title: 'Not found', id: n };
        });
      },
    },
    $trs: {
      documentTitle: 'All channels',
    },
  };

</script>
