import { getThumbnail } from 'kolibri-api';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      thumbnail: null,
    };
  },
  computed: {
    ...mapGetters(['getAsset']),
  },
  methods: {
    async getThumbnail() {
      if (!this.node.thumbnail && process.env.VUE_APP_USE_MOCK_DATA === 'true') {
        this.thumbnail = this.getAsset('defaultThumbnail');
        return;
      }
      if (this.node.thumbnail) {
        this.thumbnail = this.node.thumbnail;
        return;
      }
      const thumbnail = await getThumbnail(this.node);
      if (thumbnail) {
        this.thumbnail = thumbnail;
      } else {
        this.thumbnail = this.getAsset('defaultThumbnail');
      }
    },
  },
  created() {
    if (this.node) {
      this.getThumbnail();
    }
  },
};
