<template>
  <span
    v-b-hover="handleHover"
    role="button"
    class="text-decoration-none text-reset"
    :disabled="contentLinkDisabled"
    @click.stop="onClick"
  >
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'EkContentLink',
  props: {
    url: {
      type: String,
      required: true,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    contentLinkDisabled() {
      return !this.enabled;
    },
  },
  emits: ['isHovered'],
  methods: {
    handleHover(hovered) {
      this.$emit('isHovered', hovered);
    },
    onClick() {
      if (this.enabled)
        this.$router.push(this.url);
    },
  },
};
</script>
