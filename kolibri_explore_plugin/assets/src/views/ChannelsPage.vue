<template>

  <div class="channels d-flex flex-column h-100">
    <PageHeader
      :title="coreString('channelsLabel')"
      class="visuallyhidden"
    />

    <Header />
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

  import { ContentNodeResource } from 'kolibri.resources';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
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
        nodes: {},
        loading: true,
      };
    },
    computed: {
      tags() {
        return DemoData.tags;
      },
    },
    mounted() {
      this.tags.forEach(t => {
        const nodes = t.nodes.map(nodeID => {
          return ContentNodeResource.fetchModel({ id: nodeID })
            .then(result => {
              this.nodes[nodeID] = result;
            })
            .catch(() => {
              this.nodes[nodeID] = null;
            });
        });
        Promise.all(nodes)
          .then(() => {
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      });
    },
    methods: {
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
