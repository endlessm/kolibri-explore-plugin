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
        hasTransparentBg: false,
      };
    },
    computed: {
      thumbnailStyles() {
        const styles = {
          backgroundColor: 'white',
          backgroundImage: `url(${this.channel.thumbnail})`,
          backgroundSize: '100% auto',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        };

        if (this.hasTransparentBg) {
          styles.backgroundSize = '80% auto';
        }

        return styles;
      },
    },
    updated() {
      this.calculateTransparency();
    },
    mounted() {
      this.calculateTransparency();
    },
    methods: {
      calculateTransparency() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          const { data } = ctx.getImageData(0, 0, 1, 1);
          const [,,, alpha] = data;
          this.hasTransparentBg = (alpha === 0);
        };
        img.src = this.channel.thumbnail;
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../styles';

  .thumbnail {
    transition: background 0.2s ease;
  }

  .sm {
    $size: 32px;
    min-height: $size;
    min-width: $size;
    max-height: $size;
    max-width: $size;
    border-radius: 1rem;
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
