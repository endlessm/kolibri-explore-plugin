<template>
  <b-button pill variant="dark" class="card-media-type m-2"
    v-on:click="goToContent(node)"
  >
    <span class="icon align-middle">
      <b-icon :icon="icon" aria-hidden="true" />
    </span>
    <span class="align-middle">
      {{ mediaInfo }}
    </span>
  </b-button>
</template>

<script>
import { mapGetters } from 'vuex';
import { goToContent } from 'kolibri-api';

export default {
  props: ['node'],
  data() {
    return {
      isHovered: false,
    };
  },
  computed: {
    ...mapGetters({
      getFirstStructuredTag: 'filters/getFirstStructuredTag',
    }),
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
      switch (this.node.kind) {
        case 'video': {
          const duration = this.getFirstStructuredTag(this.node, 'duration');
          if (!duration) {
            return 'video';
          }

          let minutes = Math.floor(duration / 60);
          if (minutes > 60) {
            const hours = Math.floor(minutes / 60);
            minutes %= 60;
            return `${hours}h ${minutes}`;
          }

          const seconds = duration % 60;
          return `${minutes}m ${seconds}`;
        }
        case 'html5':
          return 'App';
        default:
          return this.node.kind;
      }
    },
  },
  methods: {
    goToContent,
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

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
