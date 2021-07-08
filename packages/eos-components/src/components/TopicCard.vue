<template>
  <b-card
    noBody
    class="my-2 rounded-lg"
    :class="{
      'shadow-sm': !isHovered,
      'shadow': isHovered,
    }"
  >
    <ContentLink :url="url" @isHovered="(hovered) => isHovered = hovered">
      <b-card-body class="bg-primary">
        <div
          v-if="isLowQuality"
          class="float-left low-quality-img"
        >
          <b-img
            fluid
            :src="thumbnail"
            v-bind="thumbnailProps"
            rounded
            :alt="node.title"
          />
        </div>
        <div class="card-img" :style="cardStyle">
          <span class="sr-only">{{ node.title }}</span>
        </div>
        <div class="body-wrapper">
          <b-card-title>
            <VClamp
              autoresize
              :maxLines="titleMaxLines"
              @clampchange="(e) => isTitleClamped = e"
            >
              {{ node.title }}
            </VClamp>
          </b-card-title>
          <b-card-text>
            <VClamp
              autoresize
              :maxLines="descriptionMaxLines"
            >
              {{ node.description }}
            </VClamp>
          </b-card-text>
        </div>
      </b-card-body>
      <b-card-footer class="text-truncate">
        <b-icon-files class="mr-2" />
        {{ subtitle }}
      </b-card-footer>
    </ContentLink>
  </b-card>
</template>

<script>
import VClamp from 'vue-clamp';
import { MediaQuality, ThumbnailSize } from '../constants';
import cardMixin from './mixins/cardMixin.js';

export default {
  name: 'TopicCard',
  components: {
    VClamp,
  },
  mixins: [cardMixin],
  props: {
    node: Object,
    subtitle: String,
    url: String,
    mediaQuality: String,
  },
  data() {
    return {
      isHovered: false,
      isTitleClamped: false,
      thumbnailProps: { width: ThumbnailSize.width, height: ThumbnailSize.height },
    };
  },
  computed: {
    isLowQuality() {
      return this.mediaQuality === MediaQuality.LOW;
    },
    cardStyle() {
      if (this.isLowQuality) {
        return {};
      }
      return {
        backgroundImage: `url("${this.thumbnail}")`,
      };
    },
    titleMaxLines() {
      if (!this.node.description) {
        return 5;
      }
      return 3;
    },
    descriptionMaxLines() {
      if (this.isTitleClamped) {
        return 2;
      }
      return 5;
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../styles.scss';

.card {
  @include transition($btn-transition);
}

.card-body {
  border-top-left-radius: $border-radius-lg;
  border-top-right-radius: $border-radius-lg;
  // This 8 is an estimation:
  height: card-body-height(9);
  justify-content: space-between;
}

.card-title, .card-text {
  color: $white;
}

.card-text {
  flex-grow: 3;
}

// Move padding from card body to the single card text:
.card-body {
  padding: 0;
}
.body-wrapper {
  padding: $card-spacer-x;
}

.low-quality-img {
  padding: $card-spacer-x;
}

.card-img {
  border-top-left-radius: $border-radius-lg;
  border-top-right-radius: $border-radius-lg;
  background-size: cover;
  background-position: center;
  padding-top: $card-image-ar;
}

</style>
