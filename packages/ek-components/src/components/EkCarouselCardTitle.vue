<template>
  <div>
    <component :is="tag">
      <EkClamp :maxLines="lines" :text="node.title" />
    </component>
    <p
      v-if="showDescription"
      class="align-self-center d-none d-sm-block mb-1 subtitle text-muted"
    >
      <EkClamp :maxLines="descriptionLines" :text="subtitle" />
    </p>
  </div>
</template>

<script>
import { getCardSubtitle } from '../utils';

export default {
  name: 'EkCarouselCardTitle',
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
