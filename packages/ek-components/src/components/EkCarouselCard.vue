<template>
  <b-card
    v-b-hover="handleHover"
    @click="$emit('click')"
  >
    <template>
      <div class="img" :style="backgroundStyle"></div>
      <b-card-text>
        <div class="card-content">
          <div class="d-lg-block d-none dh3 mb-1 title" :class="{ 'text-primary': isHovered }">
            <EkCarouselCardTitle
              :node="node"
              :showDescription="!showChannelIcon"
            />
          </div>
          <div class="d-lg-none dh4 mb-1 title" :class="{ 'text-primary': isHovered }">
            <EkCarouselCardTitle
              tag="h4"
              :node="node"
              :lines="3"
              :showDescription="!showChannelIcon"
            />
          </div>

          <div class="align-items-center d-flex justify-content-between">
            <div v-if="showChannelIcon" class="align-items-center d-flex">
              <EkChannelLogo class="mr-2" :channel="node.channel" size="sm" />
              <span class="d-md-block d-none pr-2 text-muted text-truncate">
                {{ node.channel.title }}
              </span>
            </div>
            <EkPlayButton
              class="ml-auto"
              :kind="node.kind"
              :enabled="node.available"
              @click="goToContent()"
            />
          </div>
        </div>
      </b-card-text>
    </template>
  </b-card>
</template>

<script>
import cardMixin from './mixins/cardMixin';

export default {
  name: 'EkCarouselCard',
  mixins: [cardMixin],
  props: {
    node: {
      type: Object,
      required: true,
    },
    showChannelIcon: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isHovered: false,
    };
  },
  computed: {
    backgroundStyle() {
      let bg = this.thumbnail;
      if (this.thumbnailWidth < 400) {
        bg = this.fallbackGetAsset();
      }

      return {
        backgroundImage: `url("${bg}")`,
      };
    },
  },
  methods: {
    goToContent() {
      window.kolibri.navigateTo(this.node.id);
    },
    handleHover(hovered) {
      this.isHovered = hovered;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles.scss';

.badge {
  font-size: $font-size-base;
}
.card {
  border-radius: $border-radius-lg;
  position: relative;
  background-color: $gray-700;
  color: $white;
  border: none;

  padding-left: $carousel-image-width;
  @include media-breakpoint-up(lg) {
    padding-left: $carousel-image-lg-width;
  }
}
.img {
  border-top-left-radius: $border-radius-lg;
  border-bottom-left-radius: $border-radius-lg;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  width: $carousel-image-width;
  @include media-breakpoint-up(lg) {
    width: $carousel-image-lg-width;
  }
}

.card-content .dh3 {
  min-height: 2 * ($h2-font-size * $headings-line-height) +
              2 * ($font-size-base * $line-height-base);
}

.card-content .dh4 {
  min-height: 3 * ($h4-font-size * $headings-line-height) +
              2 * ($font-size-base * $line-height-base);
}

.card-content {
  padding: ($spacer * 0.75);
}

::v-deep .card-media-type {
  position: inherit !important;
}

.card-content .dh3, .card-content .dh4 {
  transition: all ease .4s;
}

</style>
