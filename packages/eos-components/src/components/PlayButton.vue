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
import MusicNoteOutlineIcon from 'vue-material-design-icons/MusicNoteOutline.vue';
import BookOutlineIcon from 'vue-material-design-icons/BookOutline.vue';
import ClipboardTextOutlineIcon from 'vue-material-design-icons/ClipboardTextOutline.vue';
import ShapeOutlineIcon from 'vue-material-design-icons/ShapeOutline.vue';
import PlayBoxMultipleOutlineIcon from 'vue-material-design-icons/PlayBoxMultipleOutline.vue';
import PlayOutlineIcon from 'vue-material-design-icons/PlayOutline.vue';
import { MediaTypeVerbs } from '../constants';

export default {
  name: 'PlayButton',
  components: {
    MusicNoteOutlineIcon,
    BookOutlineIcon,
    ClipboardTextOutlineIcon,
    ShapeOutlineIcon,
    PlayBoxMultipleOutlineIcon,
    PlayOutlineIcon,
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
          return 'MusicNoteOutlineIcon';
        case 'document':
          return 'BookOutlineIcon';
        case 'exercise':
          return 'ClipboardTextOutlineIcon';
        case 'html5':
        case 'zim':
          return 'ShapeOutlineIcon';
        case 'bundle':
          return 'PlayBoxMultipleOutlineIcon';
        case 'video':
        default:
          return 'PlayOutlineIcon';
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
