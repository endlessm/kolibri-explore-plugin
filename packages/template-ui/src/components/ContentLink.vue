<template>
  <b-link
    :to="getNodeUrl(node)"
    class="text-reset text-decoration-none"
    v-b-hover="handleHover"
  >
    <slot></slot>
  </b-link>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: ['node'],
  emits: ['isHovered'],
  data() {
    return {
      thumbnail: null,
    };
  },
  computed: {
    ...mapGetters(['getNodeUrl']),
  },
  methods: {
    handleHover(hovered) {
      this.$emit('isHovered', hovered);
    },
  },
};
</script>
