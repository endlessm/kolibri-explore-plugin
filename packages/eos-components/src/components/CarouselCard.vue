<template>
  <ContentLink :url="url" :node="node">
    <b-carousel-slide>
      <template #img>
        <b-card>
          <template>
            <div class="img" :style="backgroundStyle"></div>
            <b-card-text>
              <div class="card-content">
                <h2 class="d-lg-block d-none mb-1 title">
                  <VClamp autoresize :maxLines="3">
                    {{ node.title }}
                  </VClamp>
                </h2>
                <h4 class="d-lg-none mb-1 title">
                  <VClamp autoresize :maxLines="4">
                    {{ node.title }}
                  </VClamp>
                </h4>
                <div class="d-flex justify-content-between">
                  <div v-if="showChannelIcon" class="align-items-center d-flex">
                    <ChannelLogo class="mr-2" :channel="node.channel" size="sm" />
                    <span class="text-muted">{{ node.channel.title }}</span>
                  </div>
                  <p v-else class="align-self-center mb-1 subtitle text-muted text-truncate">
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
    </b-carousel-slide>
  </ContentLink>
</template>

<script>
import VClamp from 'vue-clamp';
import { goToContent } from 'kolibri-api';
import { getNodeUrl, getCardSubtitle } from '../utils';
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
    url() {
      return getNodeUrl(this.node);
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
  padding-left: min(400px, 50%);
  position: relative;
  background-color: $gray-700;
  color: $white;
  border: none;
}
.img {
  border-top-left-radius: $border-radius-lg;
  border-bottom-left-radius: $border-radius-lg;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  width: min(400px, 50%);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.card-content h2 {
  min-height: 3 * ($h2-font-size * $headings-line-height);
}

.card-content h4 {
  min-height: 4 * ($h4-font-size * $headings-line-height);
}

::v-deep .card-media-type {
  position: inherit !important;
}

</style>
