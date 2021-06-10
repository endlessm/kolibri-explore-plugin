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
      <ChannelLogo class="mr-2" :channel="channel" size="md" />
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
        type: String,
        default: '',
      },
    },
    computed: {
      description() {
        return this.channel.tagline || this.channel.description;
      },
      bigThumbnailStyles() {
        return {
          background: `url(${this.thumbnail}) white`,
          backgroundSize: '100% auto',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
      },
      hasThumbnail() {
        return this.thumbnail;
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../styles';

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
    display: flex;
  }

  $card-image-ar: 376 / 600;
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
