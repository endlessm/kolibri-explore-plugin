<template>
  <b-card>
    <div
      v-if="hasThumbnail"
      class="bigThumbnail"
      :style="bigThumbnailStyles"
    >
    </div>
    <b-card-header
      class="pb-2"
      :class="{ withThumbnail: hasThumbnail }"
    >
      <div
        v-if="channel.thumbnail"
        class="mr-2 shadow-sm thumbnail"
        :style="thumbnailStyles"
      >
      </div>
      <div class="title">
        {{ channel.title }}
      </div>
    </b-card-header>
    <b-card-text class="pt-2 text-muted">
      {{ description }}
    </b-card-text>
  </b-card>
</template>

<script>
  export default {
    name: 'ChannelCard',
    props: {
      channel: {
        type: Object,
        required: true,
      },
      hasThumbnail: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      description() {
        return this.channel.tagline || this.channel.description;
      },
      thumbnailStyles() {
        return {
          background: `url(${this.channel.thumbnail}) white`,
          backgroundSize: '80% auto',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        };
      },
      bigThumbnailStyles() {
        return {
          background: `url(${this.channel.thumbnail}) white`,
          backgroundSize: '100% auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../styles';
  @import 'bootstrap/scss/bootstrap';
  @import 'bootstrap-vue/src/index';

  $thumb-size: 48px;

  .card {
    cursor: pointer;
    border-radius: $border-radius-lg !important;
    background-color: #EFF0F3 !important;
    border: 0 !important;
    transition: all 0.3s ease;
  }

  .card:hover {
    box-shadow: $box-shadow;
  }

  .card-header {
    background-color: transparent;
    padding: 0;
    font-weight: bold;
    min-height: $thumb-size;
    display: flex;
  }

  .card-text {
    font-size: $font-size-sm;
  }

  .thumbnail {
    min-height: $thumb-size;
    min-width: $thumb-size;
    border-radius: $border-radius-lg !important;
  }

  $card-image-ar: 3 / 4;
  .bigThumbnail {
    padding-top: percentage($card-image-ar);
    border-radius: $border-radius-lg !important;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.25);
  }

  .withThumbnail {
    margin-top: percentage($card-image-ar);
    padding-top: $card-spacer-y * 2;
  }
</style>
