<template>
  <span
    v-b-hover="handleHover"
    role="button"
    class="text-decoration-none text-reset"
    @click.stop="onClick"
  >
    <slot></slot>
  </span>
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
    onClick() {
      this.$router.push(this.url);
    },
  },
};
</script>
