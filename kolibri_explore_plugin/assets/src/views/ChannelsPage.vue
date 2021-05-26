<template>

  <b-container class="channels pb-3 pt-3">
    <!-- Cards without thumbnail -->
    <ChannelCardGroup
      :rows="rows.withThumbnail"
      :hasThumbnail="true"
      :columns="columns"
      @card-click="goToChannel"
    />

    <!-- Cards without thumbnail -->
    <ChannelCardGroup
      :rows="rows.withoutThumbnail"
      :hasThumbnail="false"
      :columns="columns"
      @card-click="goToChannel"
    />

  </b-container>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import { ChannelCardGroup } from 'eos-components';
  import _ from 'underscore';
  import { PageNames } from '../constants';

  export default {
    name: 'ChannelsPage',
    components: {
      ChannelCardGroup,
    },
    mixins: [commonCoreStrings],
    props: {
      columns: {
        type: Number,
        default: 3,
      },
    },
    computed: {
      ...mapState('topicsRoot', { channels: 'rootNodes' }),
      // TODO: filter this correctly, right now we're showing the first 6
      // items with thumbnail and the rest without
      rows() {
        let channels = this.channels.slice(0, 6);
        const withThumbnail = _.chunk(channels, this.columns);
        channels = this.channels.slice(6);
        const withoutThumbnail = _.chunk(channels, this.columns);

        return { withThumbnail, withoutThumbnail };
      },
    },
    methods: {
      goToChannel(channelId) {
        this.$router.push({
          name: PageNames.TOPICS_CHANNEL,
          params: { channel_id: channelId },
        });
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

</style>
