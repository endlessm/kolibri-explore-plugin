<template>

  <div id="categorized" class="pt-4">
    <div
      v-for="{ name, channels, contentPicks } in categories"
      :key="name"
      class="pb-4 pt-4"
    >
      <b-container class="pb-4">
        <h5 class="text-muted">
          {{ name }}
        </h5>
      </b-container>
      <b-container class="no-container-padding">
        <EkSlidableGrid
          v-slot="slotProps"
          :nodes="getSlidableGridNodes(channels, contentPicks)"
          :hasWhiteBackground="true"
          :itemsPerSlide="{ lg: 3, md: 2, sm: 1 }"
        >
          <template
            v-for="node in slotProps.slideNodes"
          >
            <EkChannelCard
              v-if="node !== undefined && node.kind === 'channel'"
              :key="node.id"
              :channel="node"
              @click.native="goToChannel(node.id)"
            />
            <EkCard
              v-else
              :key="node.id"
              :node="node"
            />
          </template>
        </EkSlidableGrid>
      </b-container>
    </div>
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import { getContentNodeThumbnail } from 'kolibri.utils.contentNode';
  import { EkIguanaSections } from '../customApps';
  import navigationMixin from '../mixins/navigationMixin';

  export default {
    name: 'EkIguanaList',
    mixins: [navigationMixin],
    data() {
      return {
        contentPickNodes: {},
        // FIXME display a loading screen using this state:
        loadingContentPickNodes: true,
      };
    },
    computed: {
      ...mapState('topicsRoot', { rootNodes: 'rootNodes' }),
      categories() {
        const channelsByIds = this.rootNodes.reduce((result, channel) => {
          result[channel.channel_id] = channel;
          return result;
        }, {});

        const perCategory = EkIguanaSections.map(recommended => {
          const contentPicks = this.contentPickNodes[recommended.name] || [];
          const channels = recommended.channels
            // Remove inexisting channel IDs:
            .filter(channelId => channelId in channelsByIds)
            // Map IDs to channels:
            .map(channelId => channelsByIds[channelId]);

          return {
            name: recommended.name,
            channels: channels,
            contentPicks: contentPicks,
          };
        })
          // Remove empty categories:
          .filter(
            recommended => recommended.channels.length > 0 || recommended.contentPicks.length > 0
          );

        // Add any remaining channels into a "More" special category:

        const categorizedChannels = perCategory.reduce((result, category) => {
          return [...result, ...category.channels];
        }, []);

        const remainingChannels = this.rootNodes.filter(
          channel => !categorizedChannels.includes(channel)
        );

        if (remainingChannels.length === 0) {
          // Return early if there aren't remaining channels for a "More" category:
          return perCategory;
        }

        const remainingCategory = {
          name: 'More',
          channels: remainingChannels,
          contentPicks: [],
        };

        return [...perCategory, remainingCategory];
      },
    },
    mounted() {
      return this.fetchAll();
    },
    methods: {
      fetchAll() {
        this.loadingContentPickNodes = true;
        return Promise.all(
          EkIguanaSections.map(recommended => {
            const contentPicks = recommended.contentPicks;
            return (
              Promise.all(
                contentPicks.map(id => {
                  return window.kolibri
                    .getContentById(id)
                    .then(node => {
                      return node;
                    })
                    .catch(() => {
                      return null;
                    });
                })
              )
                // Filter out the content not found:
                .then(nodes => {
                  return nodes.filter(n => n !== null);
                })
                // Mutate the nodes so they can be displayed in the carousel:
                .then(nodes => {
                  nodes.forEach(node => {
                    const thumbnailUrl = getContentNodeThumbnail(node);
                    node.thumbnail = thumbnailUrl;
                    node.channel = this.rootNodes.find(c => c.id === node.channel_id);
                    const base = `/topics/${node.channel_id}`;
                    if (node.kind === 'topic') {
                      node.nodeUrl = `${base}/t/${node.id}`;
                    } else {
                      node.nodeUrl = `${base}/c/${node.id}`;
                    }
                  });
                  this.$set(this.contentPickNodes, recommended.name, nodes);
                })
            );
          })
        ).then(() => {
          this.loadingContentPickNodes = false;
        });
      },
      getSlidableGridNodes(channels, contentPicks) {
        return channels.concat(contentPicks);
      },
    },
  };

</script>
