<template>
  <b-link
    v-b-hover="handleHover"
    class="text-decoration-none text-reset"
    @click="onClick"
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
    onClick() {
      this.$router.push(this.url);
    },
  },
};
</script>
