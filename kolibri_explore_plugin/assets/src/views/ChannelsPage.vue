<template>

  <div class="channels">
    <h1>Explore</h1>
    <PageHeader
      :title="coreString('channelsLabel')"
      class="visuallyhidden"
    />
    <ChannelCardGroupGrid
      v-if="channels.length"
      class="grid"
      :contents="channels"
      :genContentLink="genChannelLink"
    />
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import { PageNames } from '../constants';
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
    },
    mixins: [commonCoreStrings],
    computed: {
      ...mapState('topicsRoot', { channels: 'rootNodes' }),
    },
    methods: {
      genChannelLink(channel_id) {
        return {
          name: PageNames.TOPICS_CHANNEL,
          params: { channel_id },
        };
      },
    },
    $trs: {
      documentTitle: 'All channels',
    },
  };

</script>


<style lang="scss" scoped>

  .grid {
    margin-top: 24px;
  }

  .channels {
    width: 100%;
    height: 100vh;
    min-height: 600px;
    padding: 20px;
    color: white;
    background-color: #3a3a3a;
  }

</style>
