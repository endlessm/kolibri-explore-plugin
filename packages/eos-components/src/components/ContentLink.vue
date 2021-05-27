<template>
  <b-link
    v-b-hover="handleHover"
    :to="url"
    class="text-decoration-none text-reset"
  >
    <slot></slot>
  </b-link>
</template>

<script>
export default {
  name: 'ContentLink',
  props: {
    url: String,
  },
  emits: ['isHovered'],
  methods: {
    handleHover(hovered) {
      this.$emit('isHovered', hovered);
    },
  },
};
</script>
