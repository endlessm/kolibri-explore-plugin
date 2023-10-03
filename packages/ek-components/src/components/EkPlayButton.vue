<template>
  <b-button
    pill
    :size="size"
    :block="block"
    variant="gray-primary"
    :disabled="buttonDisabled"
    class="pb-1 pl-1 pt-1 text-nowrap"
    @click.stop.prevent="$emit('click')"
  >
    <component
      :is="icon"
      :size="iconSize"
    />
    <span class="play-button-text">
      {{ mediaInfo }}
    </span>
  </b-button>
</template>

<script>
import AudioIcon from 'vue-material-design-icons/Podcast.vue';
import DocumentIcon from 'vue-material-design-icons/TextBoxOutline.vue';
import ExerciseIcon from 'vue-material-design-icons/CheckboxMarkedCircleOutline.vue';
import Html5Icon from 'vue-material-design-icons/MotionOutline.vue';
import BundleIcon from 'vue-material-design-icons/CubeOutline.vue';
import VideoIcon from 'vue-material-design-icons/PlayCircleOutline.vue';
import { MediaTypeVerbs, mediaTypeVerb } from '../constants';

export default {
  name: 'EkPlayButton',
  components: {
    AudioIcon,
    DocumentIcon,
    ExerciseIcon,
    Html5Icon,
    BundleIcon,
    VideoIcon,
  },
  props: {
    enabled: {
      type: Boolean,
      default: true,
    },
    kind: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'sm',
    },
    block: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    buttonDisabled() {
      return !this.enabled;
    },
    icon() {
      switch (this.kind) {
        case 'audio':
          return 'AudioIcon';
        case 'document':
          return 'DocumentIcon';
        case 'exercise':
          return 'ExerciseIcon';
        case 'html5':
        case 'zim':
        case 'slideshow':
        case 'h5p':
        case 'quiz':
          return 'Html5Icon';
        case 'bundle':
          return 'BundleIcon';
        case 'video':
        default:
          return 'VideoIcon';
      }
    },
    iconSize() {
      switch (this.size) {
        case 'xs':
          return 20;
        default:
          return 24;
      }
    },
    mediaInfo() {
      if (this.label) {
        return this.label;
      }
      if (this.kind in MediaTypeVerbs) {
        return mediaTypeVerb(this.kind);
      }
      return mediaTypeVerb('video');
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles.scss';

.play-button-text {
  // Align the text with the material design icons:
  line-height: 12px;
  vertical-align: middle;
  text-transform: uppercase;
}

button:disabled {
  opacity: 0.5;
  background-color: $play-button-disabled-bg-color;
}

</style>
