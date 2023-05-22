<template>
  <div
    class="bg-white thumbnail"
    :class="size"
    :style="thumbnailStyles"
  >
  </div>
</template>

<script>
  export default {
    name: 'EkChannelLogo',
    props: {
      channel: {
        type: Object,
        required: true,
      },
      size: {
        type: String,
        default: 'sm',
        validator: (value) => {
          // The value must match one of these strings
          return ['sm', 'md', 'lg', 'xl'].indexOf(value) !== -1;
        },
      },
    },
    computed: {
      thumbnailStyles() {
        const styles = {
          backgroundImage: `url(${this.channel.thumbnail})`,
        };
        return styles;
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../styles';

  .thumbnail {
    transition: background 0.2s ease;
    background-size: 100% auto;
    background-position: center;
    background-repeat: no-repeat;
  }

  .sm {
    $size: 24px;
    min-height: $size;
    min-width: $size;
    max-height: $size;
    max-width: $size;
    border-radius: $border-radius-sm;
    box-shadow: $box-shadow-sm;
  }

  .md {
    $size: 72px;
    min-height: $size;
    min-width: $size;
    max-height: $size;
    max-width: $size;
    border-radius: $border-radius-sm;
    box-shadow: $box-shadow-sm;
  }

  .lg {
    $size: 96px;
    min-height: $size;
    min-width: $size;
    max-height: $size;
    max-width: $size;
    border-radius: $border-radius-lg;
    box-shadow: $box-shadow;
  }

  .xl {
    $size: 128px;
    min-height: $size;
    min-width: $size;
    max-height: $size;
    max-width: $size;
    border-radius: $border-radius-lg;
    box-shadow: $box-shadow;
  }
</style>
