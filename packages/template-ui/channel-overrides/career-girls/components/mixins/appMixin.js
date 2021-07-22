import { askChannelInformation, fetchCollection } from 'kolibri-api';

// TODO: Watch the section changes and fetch the required child nodes

export default {
  created() {
    askChannelInformation((data) => {
      const { channel, nodes } = data;
      this.channelLoad(channel, nodes);
    }, false);
  },
  methods: {
    channelLoad(channel, nodes) {
      const sections = nodes.filter((n) => n.kind === 'topic').map((n) => n.id);
      const getParams = {
        channel_id: channel.id,
        parent_in: sections.join(','),
      };
      fetchCollection((data) => {
        this.gotChannelInformation({
          channel,
          nodes: [channel, ...nodes, ...data.nodes],
        });
      }, getParams);
    },
    gotChannelInformation(data) {
      this.$store.commit('setChannelInformation', data);
      this.$store.commit('setHomeNavigation');
      const uri = window.location.search.substring(1);
      const params = new URLSearchParams(uri);
      // Check if we need to navigate to a specific content or topic. Content takes precedence.
      const contentId = params.get('contentId');
      if (contentId) {
        this.$router.push(`/c/${contentId}`);
        return;
      }
      const topicId = params.get('topicId');
      if (topicId) {
        this.$router.push(`/t/${topicId}`);
      }
      const test = params.get('test');
      if (test) {
        this.$router.push('/test');
      }
    },
  },
};
