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
      <b-card-body>
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
        <b-card-text>
          <CardBody :node="node" :subtitle="subtitle" />
          <PlayButton
            :kind="node.kind"
            :label="label"
            @click="goToContent(node)"
          />
        </b-card-text>
      </b-card-body>
    </ContentLink>
  </b-card>
</template>

<script>
import { goToContent } from 'kolibri-api';
import { MediaQuality, ThumbnailSize } from '../constants';
import cardMixin from './mixins/cardMixin.js';

export default {
  name: 'ContentCard',
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
  },
  methods: {
    goToContent,
  },
};
</script>

<style lang="scss" scoped>
@import '../styles.scss';

.card {
  transition: all ease .4s;
  &:hover {
    color: $primary;
  }
}

// Move padding from card body to the single card text:
.card-body {
  padding: 0;
}
.card-text {
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
