<template>
  <b-card>
    <b-card-header class="pb-2">
      <div
        v-if="channel.thumbnail"
        class="mr-2 thumbnail"
        :style="thumbnailStyles">
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
      thumbnail: {
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
          background: `url(${this.channel.thumbnail})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        };
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../styles';
  @import 'bootstrap/scss/bootstrap';
  @import 'bootstrap-vue/src/index';

  $thumb-size: 72px;

  .card {
    cursor: pointer;
    border-radius: $border-radius-lg !important;
    background-color: #EFF0F3 !important;
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
    height: $thumb-size;
    width: $thumb-size;
    border-radius: $border-radius-lg !important;
  }
</style>
