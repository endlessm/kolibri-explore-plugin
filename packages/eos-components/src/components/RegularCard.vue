<template>
  <b-card
    noBody
    class="my-2 rounded-lg"
    :class="{
      'shadow-sm': !isHovered,
      shadow: isHovered,
    }"
  >
    <ContentLink :url="url" @isHovered="(hovered) => isHovered = hovered">
      <b-card-body>
        <div class="card-img" :style="cardStyle">
          <span class="sr-only">{{ node.title }}</span>
        </div>
        <b-card-text>
          <CardBody :node="node" :subtitle="subtitle" />
          <PlayButton
            :node="node"
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
import cardMixin from './mixins/cardMixin.js';

export default {
  name: 'RegularCard',
  mixins: [cardMixin],
  props: {
    node: Object,
    subtitle: String,
    url: String,
  },
  data() {
    return {
      isHovered: false,
    };
  },
  computed: {
    cardStyle() {
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

$card-image-ar: 9 / 16;

.card-img {
  border-top-left-radius: $border-radius-lg;
  border-top-right-radius: $border-radius-lg;
  background-size: cover;
  background-position: center;
  padding-top: percentage($card-image-ar);
}

</style>
