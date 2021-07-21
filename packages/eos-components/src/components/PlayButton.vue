<template>
  <b-button
    pill
    size="sm"
    :variant="`${kind}-${variant}`"
    class="border-0 pb-1 pl-1 play-button pt-1"
    @click.stop="$emit('click')"
  >
    <component
      :is="icon"
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
    kind: String,
    label: String,
    variant: {
      type: String,
      default: 'primary',
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
  vertical-align: text-bottom;
  text-transform: uppercase;
}

</style>
