<template>
  <b-card @click="$emit('click')">
    <template>
      <div class="img" :style="backgroundStyle"></div>
      <b-card-text>
        <div class="card-content">
          <div v-if="node.description" class="head">
            <h3 class="limit mb-1 title">
              <VClamp autoresize :maxLines="1">
                {{ node.title }}
              </VClamp>
            </h3>
            <p class="node-description text-muted">
              <VClamp autoresize :maxLines="3">
                {{ node.description }}
              </VClamp>
            </p>
          </div>
          <div v-else class="head">
            <h3 class="d-lg-block d-none mb-1 title">
              <VClamp autoresize :maxLines="3">
                {{ node.title }}
              </VClamp>
            </h3>
            <h4 class="d-lg-none mb-1 title">
              <VClamp autoresize :maxLines="4">
                {{ node.title }}
              </VClamp>
            </h4>
          </div>
          <div class="align-items-center d-flex justify-content-between">
            <div v-if="showChannelIcon" class="align-items-center d-flex">
              <ChannelLogo class="mr-2" :channel="node.channel" size="sm" />
              <span class="d-md-block d-none pr-2 text-muted text-truncate">
                {{ node.channel.title }}
              </span>
            </div>
            <p
              v-else
              :class="`align-self-center d-none d-sm-block
                       mb-1 pr-2 subtitle text-muted text-truncate`"
            >
              {{ subtitle }}
            </p>
            <PlayButton
              class="ml-auto"
              :kind="node.kind"
              @click="goToContent(node)"
            />
          </div>
        </div>
      </b-card-text>
    </template>
  </b-card>
</template>

<script>
import VClamp from 'vue-clamp';
import { goToContent } from 'kolibri-api';
import { getCardSubtitle } from '../utils';
import cardMixin from './mixins/cardMixin';

export default {
  name: 'CarouselCard',
  components: {
    VClamp,
  },
  mixins: [cardMixin],
  props: {
    node: Object,
    showChannelIcon: {
      type: Boolean,
      default: false,
    },
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
    subtitle() {
      let fallback = '';
      if (this.$store) {
        const { state } = this.$store;
        if (state.channel) {
          fallback = state.channel.title;
        }
      }
      return getCardSubtitle(this.node, fallback);
    },
  },
  methods: {
    goToContent,
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

.card-content .head {
  min-height: 3 * ($h2-font-size * $headings-line-height);
  @include media-breakpoint-down(lg) {
    min-height: 4 * ($h4-font-size * $headings-line-height);
  }
}

.card-content {
  padding: ($spacer * 0.75);
}

::v-deep .card-media-type {
  position: inherit !important;
}

</style>
