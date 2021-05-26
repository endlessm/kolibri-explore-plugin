<template>
  <b-button
    pill
    variant="dark"
    class="card-media-type m-2"
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

.card-media-type {
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5) !important;
}
.icon {
  font-size: $font-size-lg;
}

</style>
