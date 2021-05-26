<template>
  <b-button
    pill
    variant="light"
    :class="`card-media-type m-2 ${node.kind}`"
    @click="$emit('click')"
  >
    <span class="align-middle icon">
      <b-icon :icon="icon" aria-hidden="true" />
    </span>
    <span class="align-middle">
      {{ mediaInfo }}
    </span>
  </b-button>
</template>

<script>
import { MediaTypeVerbs } from '../constants';

export default {
  name: 'PlayButton',
  props: {
    node: Object,
    label: String,
  },
  computed: {
    icon() {
      switch (this.node.kind) {
        case 'video':
          return 'play-fill';
        case 'audio':
          return 'music-note';
        case 'exercise':
          return 'clipboard-check';
        case 'html5':
          return 'box';
        case 'document':
          return 'file-earmark-text';
        default:
          return 'file-earmark';
      }
    },
    mediaInfo() {
      if (this.label) {
        return this.label;
      }
      return MediaTypeVerbs[this.node.kind];
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles.scss';

$background-alpha: 0.8;

.card-media-type {
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  &.audio {
    background-color: rgba($audio-color, $background-alpha);
  }
  &.document {
    background-color: rgba($document-color, $background-alpha);
  }
  &.exercise {
    background-color: rgba($exercise-color, $background-alpha);
  }
  &.html5 {
    background-color: rgba($html5-color, $background-alpha);
  }
  &.video {
    background-color: rgba($video-color, $background-alpha);
  }
}
.icon {
  font-size: $font-size-lg;
}

</style>
