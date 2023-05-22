<template>
  <div>
    <component :is="tag">
      <VClamp autoresize :maxLines="lines">
        {{ node.title }}
      </VClamp>
    </component>
    <p
      v-if="showDescription"
      class="align-self-center d-none d-sm-block mb-1 subtitle text-muted"
    >
      <VClamp autoresize :maxLines="descriptionLines">
        {{ subtitle }}
      </VClamp>
    </p>
  </div>
</template>

<script>
import VClamp from 'vue-clamp';
import { getCardSubtitle } from '../utils';

export default {
  name: 'CarouselCardTitle',
  components: {
    VClamp,
  },
  props: {
    node: {
      type: Object,
      required: true,
    },
    tag: {
      type: String,
      default: 'h3',
    },
    lines: {
      type: Number,
      default: 2,
    },
    descriptionLines: {
      type: Number,
      default: 2,
    },
    showDescription: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    subtitle() {
      let fallback = '';
      if (this.$store) {
        const { state } = this.$store;
        if (state.channel) {
          fallback = state.channel.title;
        }
      }
      if (this.$store && this.$store.state.isEndlessApp) {
        return getCardSubtitle(this.node, fallback);
      }
      return this.node.description;
    },
  },
};
</script>
