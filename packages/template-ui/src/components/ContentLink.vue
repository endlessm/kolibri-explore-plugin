<template>
  <b-link
    v-b-hover="handleHover"
    :to="getNodeUrl(node)"
    class="text-decoration-none text-reset"
  >
    <slot></slot>
  </b-link>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ContentLink',
  props: {
    node: Object,
  },
  emits: ['isHovered'],
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
