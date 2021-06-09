<template>
  <div
    class="thumbnail"
    :class="size"
    :style="thumbnailStyles"
  >
  </div>
</template>

<script>
  export default {
    name: 'ChannelLogo',
    props: {
      channel: Object,
      size: {
        type: String,
        default: 'sm',
        validator: (value) => {
          // The value must match one of these strings
          return ['sm', 'md', 'lg', 'xl'].indexOf(value) !== -1;
        },
      },
    },
    data() {
      return {
      };
    },
    computed: {
      thumbnailStyles() {
        return {
          background: `url(${this.channel.thumbnail}) white`,
          backgroundSize: '80% auto',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        };
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../styles';

  .thumbnail {
  }

  .sm {
    $size: 32px;
    min-height: $size;
    min-width: $size;
    max-height: $size;
    max-width: $size;
    border-radius: 16px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.075);
  }

  .md {
    $size: 72px;
    min-height: $size;
    min-width: $size;
    max-height: $size;
    max-width: $size;
    border-radius: 16px;
    box-shadow: $box-shadow-sm;
  }

  .lg {
    $size: 128px;
    min-height: $size;
    min-width: $size;
    max-height: $size;
    max-width: $size;
    border-radius: 24px;
    box-shadow: $box-shadow;
  }

  .xl {
    $size: 248px;
    min-height: $size;
    min-width: $size;
    max-height: $size;
    max-width: $size;
    border-radius: 32px;
    box-shadow: $box-shadow;
  }
</style>
