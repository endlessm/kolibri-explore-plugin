<template>

  <b-container class="channels pb-5">
    <div v-for="{ name, channels } in categories" :key="name">
      <h5 class="pt-4 text-muted">
        {{ name }}
      </h5>
      <ChannelCardGroup
        class="pb-4"
        :rows="chunk(channels)"
        :columns="columns"
        @card-click="goToChannel"
      />
    </div>
  </b-container>

</template>


<script>

  import { mapState } from 'vuex';
  import _ from 'underscore';
  import { responsiveMixin } from 'eos-components';
  import { PageNames } from '../constants';
  import { CategorizedChannelIds } from '../customApps';

  export default {
    name: 'ChannelsList',
    mixins: [responsiveMixin],

    computed: {
      ...mapState('topicsRoot', { rootNodes: 'rootNodes' }),
      categories() {
        const channelsByIds = this.rootNodes.reduce((result, channel) => {
          result[channel.channel_id] = channel;
          return result;
        }, {});

        const channelsPerCategory = CategorizedChannelIds.map(recommended => {
          const channels = recommended.channels
            // Remove inexisting channel IDs:
            .filter(channelId => channelId in channelsByIds)
            // Map IDs to channels:
            .map(channelId => channelsByIds[channelId]);

          return {
            name: recommended.name,
            channels: channels,
          };
        })
          // Remove categories with an empty channels list:
          .filter(recommended => recommended.channels.length > 0);

        // Add any remaining channels into a "More" special category:

        const categorizedChannels = channelsPerCategory.reduce((result, category) => {
          return [...result, ...category.channels];
        }, []);

        const remainingChannels = this.rootNodes.filter(
          channel => !categorizedChannels.includes(channel)
        );

        if (remainingChannels.length === 0) {
          // Return early if there aren't remaining channels for a "More" category:
          return channelsPerCategory;
        }

        const remainingCategory = {
          name: 'More',
          channels: remainingChannels,
        };

        return [...channelsPerCategory, remainingCategory];
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
