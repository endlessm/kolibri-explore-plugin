import { getFirstStructuredTag } from '../../utils';
import { StructuredTags } from '../../constants';
import { cardImageAspectRatio } from '../../styles.scss';

import AppThumb from '../../assets/thumbnails/app.png';
import AudioThumb from '../../assets/thumbnails/audio.png';
import BundleThumb from '../../assets/thumbnails/bundle.png';
import DocumentThumb from '../../assets/thumbnails/document.png';
import ExerciseThumb from '../../assets/thumbnails/exercise.png';
import TopicThumb from '../../assets/thumbnails/topic.png';
import VideoThumb from '../../assets/thumbnails/video.png';

export default {
  data() {
    return {
      thumbnail: null,
      thumbnailWidth: null,
      thumbnailAspectRatio: null,
    };
  },
  computed: {
    label() {
      return this.getDuration();
    },
    isThumbnailWide() {
      return this.thumbnailAspectRatio <= cardImageAspectRatio;
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
      if (this.node.files) {
        const thumbnail = this.node.files.find((f) => f.thumbnail);
        if (thumbnail && thumbnail.storage_url) {
          this.thumbnail = thumbnail.storage_url;
        } else {
          this.thumbnail = this.getAsset('defaultThumbnail');
        }
      }
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
        this.thumbnailAspectRatio = img.height / img.width;
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
