<template>
  <b-button
    pill
    variant="light"
    :class="`card-media-type m-2 ${node.kind}`"
    @click.stop="$emit('click')"
  >
    <span class="align-middle">
      <img :src="icon" aria-hidden="true">
    </span>
    <span class="align-middle">
      {{ mediaInfo }}
    </span>
  </b-button>
</template>

<script>
import { MediaTypeVerbs } from '../constants';
import AudioIcon from '../assets/audio.svg';
import DocumentIcon from '../assets/document.svg';
import ExerciseIcon from '../assets/exercise.svg';
import Html5Icon from '../assets/html5.svg';
import VideoIcon from '../assets/video.svg';

export default {
  name: 'PlayButton',
  props: {
    node: Object,
    label: String,
  },
  computed: {
    icon() {
      switch (this.node.kind) {
        case 'audio':
          return AudioIcon;
        case 'document':
          return DocumentIcon;
        case 'exercise':
          return ExerciseIcon;
        case 'html5':
          return Html5Icon;
        case 'video':
        default:
          return VideoIcon;
      }
    },
    mediaInfo() {
      if (this.label) {
        return this.label;
      }
      return MediaTypeVerbs[this.node.kind].toUpperCase();
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

</style>
