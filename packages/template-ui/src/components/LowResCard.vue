<template>
  <b-card
    border-variant="light"
    class="my-2"
  >
    <ContentLink :node="node">
      <b-card-img
        :src="thumbnail"
        :alt="node.title"
      />
      <CardMediaType :node="node" />
      <b-card-text>
        <CardBody :node="node" />
      </b-card-text>
    </ContentLink>
  </b-card>
</template>

<script>
import cardMixin from '@/components/mixins/cardMixin';

export default {
  props: ['node'],
  mixins: [cardMixin],
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
