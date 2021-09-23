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
          class="card-img"
          :class="{ 'low-quality': isLowQuality, 'is-thumbnail-wide': isThumbnailWide }"
          :style="cardStyle"
        >
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
import { MediaQuality } from '../constants';
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
    };
  },
  computed: {
    isLowQuality() {
      return this.mediaQuality === MediaQuality.LOW;
    },
    cardStyle() {
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
        window.kolibri.navigateTo(this.node.id);
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
  padding-top: percentage($card-image-ar);
  &.low-quality {
    background-size: auto calc(100% - #{$card-spacer-x});
    background-position: $card-spacer-x $card-spacer-x;
    background-repeat: no-repeat;
    &.is-thumbnail-wide {
      background-size: calc(100% - 2 * #{$card-spacer-x}) auto;
    };
  };
}

</style>
