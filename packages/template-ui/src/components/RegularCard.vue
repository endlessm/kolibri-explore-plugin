<template>
  <b-card
    class="my-2 rounded-lg"
    :class="{
      shadow: !isHovered,
      'shadow-lg': isHovered,
    }"
  >
    <ContentLink :node="node" @isHovered="(hovered) => isHovered = hovered">
      <div class="card-img" :style="cardStyle">
        <span class="sr-only">{{ node.title }}</span>
      </div>
      <PlayButton
        v-if="node.kind !== 'topic'"
        :node="node"
        :label="label"
        @click="goToContent(node)"
      />
      <b-card-text>
        <CardBody :node="node" />
      </b-card-text>
    </ContentLink>
  </b-card>
</template>

<script>
import cardMixin from '@/components/mixins/cardMixin';
import { goToContent } from 'kolibri-api';

export default {
  name: 'RegularCard',
  mixins: [cardMixin],
  props: {
    node: Object,
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
@import '@/styles.scss';

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
