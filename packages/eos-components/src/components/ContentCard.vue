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
        <div class="body-wrapper">
          <CardBody :node="node" :subtitle="subtitle" />
          <PlayButton
            :kind="kind"
            @click="onClick"
          />
        </div>
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
    isBundle: Boolean,
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
    kind() {
      if (this.isBundle) {
        return 'bundle';
      }
      return this.node.kind;
    },
  },
  methods: {
    onClick() {
      if (this.kind === 'bundle') {
        this.$router.push(this.url);
      } else {
        goToContent(this.node);
      }
    },
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
.body-wrapper {
  padding: $card-spacer-x;
}

.low-quality-img {
  padding: $card-spacer-x;
}

.card-img {
  border-radius: $border-radius-lg $border-radius-lg 0 0;
  background-size: cover;
  background-position: center;
  padding-top: $card-image-ar;
}

</style>
