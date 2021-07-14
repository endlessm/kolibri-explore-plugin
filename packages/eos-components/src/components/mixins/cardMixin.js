import { getThumbnail } from 'kolibri-api';
import { getFirstStructuredTag } from '../../utils';
import { MediaQuality, StructuredTags } from '../../constants';

import AppThumb from '../../assets/thumbnails/app.jpg';
import AudioThumb from '../../assets/thumbnails/audio.jpg';
import BundleThumb from '../../assets/thumbnails/bundle.jpg';
import DocumentThumb from '../../assets/thumbnails/document.jpg';
import ExerciseThumb from '../../assets/thumbnails/exercise.jpg';
import TopicThumb from '../../assets/thumbnails/topic.png';
import VideoThumb from '../../assets/thumbnails/video.jpg';

export default {
  data() {
    return {
      thumbnail: null,
      thumbnailWidth: null,
    };
  },
  computed: {
    label() {
      return this.getDuration();
    },
  },
  methods: {
    getThumbnail() {
      if (!this.node.thumbnail && this.node.useDefaultThumbnail) {
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
      if (this.isBundle) {
        return BundleThumb;
      }
      switch (this.node.kind) {
        case 'audio':
          return AudioThumb;
        case 'document':
          return DocumentThumb;
        case 'exercise':
          return ExerciseThumb;
        case 'video':
          return VideoThumb;
        case 'html5':
        case 'zim':
          return AppThumb;
        case 'topic':
        default:
          if (this.mediaQuality === MediaQuality.LOW) {
            return BundleThumb;
          }
          return TopicThumb;
      }
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
  watch: {
    thumbnail(value) {
      const img = new Image();
      img.onload = () => {
        this.thumbnailWidth = img.width;
      };
      img.src = value;
    },
    node() {
      this.getThumbnail();
    },
  },
  created() {
    if (this.node) {
      this.getThumbnail();
    }
  },
};
