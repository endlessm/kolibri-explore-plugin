<template>

  <div id="categorized-channels" class="pt-4">
    <div
      v-for="{ name, channels } in categories"
      :key="name"
      class="pb-4 pt-4"
    >
      <b-container class="pb-4">
        <h5 class="text-muted">
          {{ name }}
        </h5>
      </b-container>
      <b-container class="no-container-padding">
        <SlidableGrid
          v-slot="slotProps"
          :nodes="channels"
          :hasWhiteBackground="true"
        >
          <ChannelCard
            v-for="channel in slotProps.slideNodes"
            :key="channel.id"
            :channel="channel"
            @click.native="goToChannel(channel.id)"
          />
        </SlidableGrid>
      </b-container>
    </div>
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import { PageNames } from '../constants';
  import { CategorizedChannelIds } from '../customApps';

  export default {
    name: 'CategorizedChannelsList',
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
