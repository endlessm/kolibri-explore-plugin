import { getThumbnail } from 'kolibri-api';
import { getFirstStructuredTag } from '../../utils';
import { StructuredTags } from '../../constants';

export default {
  data() {
    return {
      thumbnail: null,
    };
  },
  computed: {
    label() {
      return this.getDuration();
    },
  },
  methods: {
    getThumbnail() {
      if (!this.node.thumbnail && process.env.VUE_APP_USE_MOCK_DATA === 'true') {
        this.thumbnail = this.getAsset('defaultThumbnail');
        return;
      }
      if (this.node.thumbnail) {
        this.thumbnail = this.node.thumbnail;
        return;
      }
      getThumbnail(this.node)
        .then(thumbnail => {
          if (thumbnail) {
            this.thumbnail = thumbnail;
          } else {
            this.thumbnail = this.getAsset('defaultThumbnail');
          }
        }).catch(() => {
          this.thumbnail = this.getAsset('defaultThumbnail');
        });
    },
    getAsset(name) {
      if (!this.$store || !this.$store.getters) {
        return this.fallbackGetAsset(name);
      }

      const { getAsset } = this.$store.getters;
      if (!getAsset) {
        return this.fallbackGetAsset(name);
      }
      const fn = getAsset(this.$store.state);
      if (!fn) {
        return this.fallbackGetAsset(name);
      }

      return fn(name);
    },
    fallbackGetAsset() {
      return null;
    },
    getDuration() {
      const duration = getFirstStructuredTag(this.node, StructuredTags.DURATION);
      if (!duration) {
        return null;
      }
      let minutes = Math.floor(duration / 60);
      if (minutes > 60) {
        const hours = Math.floor(minutes / 60);
        minutes %= 60;
        return `${hours}h ${minutes}`;
      }

      const seconds = duration % 60;
      return `${minutes}m ${seconds}`;
    },
  },
  created() {
    if (this.node) {
      this.getThumbnail();
    }
  },
};
