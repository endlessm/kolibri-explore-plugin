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
          <div class="card-content">
            <b-card-title titleTag="h5" class="mb-1">
              <VClamp
                autoresize
                :maxLines="titleMaxLines"
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
          <b-card-text class="my-1">
            <ImageFilterNoneIcon />
            <span class="ml-2 subtitle">
              {{ subtitle }}
            </span>
          </b-card-text>
        </div>
      </b-card-body>
    </ContentLink>
  </b-card>
</template>

<script>
import VClamp from 'vue-clamp';
import ImageFilterNoneIcon from 'vue-material-design-icons/ImageFilterNone.vue';
import { MediaQuality, ThumbnailSize } from '../constants';
import cardMixin from './mixins/cardMixin.js';

export default {
  name: 'TopicCard',
  components: {
    ImageFilterNoneIcon,
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
      descriptionMaxLines: 3,
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
      return 2;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles.scss';

.card {
  @include transition($btn-transition);
}

.card-body {
  border-radius: $border-radius-lg;
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

// This is solely to match the content card height:
$missing-height: 2px;

.body-wrapper {
  padding: $card-spacer-x;
}
.card-content {
  height: calc(#{card-body-height(2)} - #{$missing-height});
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

.subtitle {
  font-family: $btn-font-family;
  font-size: $btn-font-size;
  font-weight: $btn-font-weight;
}

</style>
