import { PageNames } from '../constants';

export default {
  methods: {
    goToChannel(channelId) {
      this.$router.push({
        name: PageNames.TOPICS_CHANNEL,
        params: { channel_id: channelId },
      });
    },
  },
};
