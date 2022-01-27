<template>

  <b-container class="channels pb-5">
    <!-- Cards with thumbnail -->
    <ChannelCardGroup
      :rows="rows.withThumbnail"
      :columns="columns"
      @card-click="goToChannel"
    />

    <!-- Cards without thumbnail -->
    <ChannelCardGroup
      :rows="rows.withoutThumbnail"
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
  import { RecommendedChannelIDs } from '../customApps';

  export default {
    name: 'ChannelsList',
    mixins: [responsiveMixin],

    computed: {
      ...mapState('topicsRoot', { channels: 'rootNodes' }),
      rows() {
        let withThumbnail = [];
        let withoutThumbnail = [];

        this.channels.forEach(channel => {
          if (RecommendedChannelIDs.includes(channel.id)) {
            withThumbnail.push(channel);
          } else {
            withoutThumbnail.push(channel);
          }
        });

        // Order the channels with thumbnail as in the ThumbApps array:
        withThumbnail = _.sortBy(withThumbnail, n => RecommendedChannelIDs.indexOf(n.id));

        // Split the channels in rows:
        withThumbnail = _.chunk(withThumbnail, this.columns);
        withoutThumbnail = _.chunk(withoutThumbnail, this.columns);
        return { withThumbnail, withoutThumbnail };
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
      goToChannel(channelId) {
        this.$router.push({
          name: PageNames.TOPICS_CHANNEL,
          params: { channel_id: channelId },
        });
      },
    },
  };

</script>
