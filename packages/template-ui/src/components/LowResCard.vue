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
  name: 'LowResCard',
  mixins: [cardMixin],
  props: {
    node: Object,
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
  padding: $card-spacer-x 0;
}

</style>
