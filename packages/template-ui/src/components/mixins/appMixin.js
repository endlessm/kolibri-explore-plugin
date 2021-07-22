import { askChannelInformation } from 'kolibri-api';

export default {
  created() {
    askChannelInformation(this.gotChannelInformation);
  },
  methods: {
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
