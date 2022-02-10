<template>

  <b-container class="channels pb-5">
    <h5 class="text-muted">
      Channels from A-Z
    </h5>
    <ChannelCardGroup
      class="pb-4"
      :rows="chunk(orderedChannels)"
      :columns="columns"
      @card-click="goToChannel"
    />
  </b-container>

</template>


<script>

  import { mapState } from 'vuex';
  import _ from 'underscore';
  import { responsiveMixin } from 'eos-components';
  import { PageNames } from '../constants';

  export default {
    name: 'AlphabeticalChannelsList',
    mixins: [responsiveMixin],

    computed: {
      ...mapState('topicsRoot', { rootNodes: 'rootNodes' }),
      orderedChannels() {
        return [...this.rootNodes].sort((channelA, channelB) =>
          channelA.title.localeCompare(channelB.title)
        );
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
    },

    methods: {
      chunk(channels) {
        return _.chunk(channels, this.columns);
      },
      goToChannel(channelId) {
        this.$router.push({
          name: PageNames.TOPICS_CHANNEL,
          params: { channel_id: channelId },
        });
      },
    },
  };

</script>
