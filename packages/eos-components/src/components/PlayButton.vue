<template>
  <b-button
    pill
    :size="size"
    :block="block"
    :variant="`${kind}-${variant}`"
    class="pb-1 pl-1 play-button pt-1 text-nowrap"
    @click.stop="$emit('click')"
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
import { MediaTypeVerbs } from '../constants';

export default {
  name: 'PlayButton',
  components: {
    AudioIcon,
    DocumentIcon,
    ExerciseIcon,
    Html5Icon,
    BundleIcon,
    VideoIcon,
  },
  props: {
    kind: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: '',
    },
    variant: {
      type: String,
      default: 'primary',
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
      return MediaTypeVerbs[this.kind];
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

</style>
