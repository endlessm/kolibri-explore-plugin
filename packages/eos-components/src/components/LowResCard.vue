<template>
  <b-card
    borderVariant="light"
    class="my-2"
  >
    <ContentLink :node="node">
      <b-card-img
        :src="thumbnail"
        :alt="node.title"
      />
      <PlayButton
        :kind="node.kind"
        :label="label"
        @click="goToContent(node)"
      />
      <b-card-text>
        <CardBody :node="node" :subtitle="subtitle" />
      </b-card-text>
    </ContentLink>
  </b-card>
</template>

<script>
import { goToContent } from 'kolibri-api';
import cardMixin from './mixins/cardMixin.js';

export default {
  name: 'LowResCard',
  mixins: [cardMixin],
  props: {
    node: Object,
    subtitle: String,
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
  padding: $card-spacer-x 0;
}

</style>
