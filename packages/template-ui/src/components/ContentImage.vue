<template>
  <b-link @click="goToContent()">
    <b-card class="rounded-lg">
      <b-img
        fluid
        :src="thumbnail"
        :alt="node.title"
        class="border d-block mt-3 mx-auto rounded"
      />
      <PlayButton
        v-if="node.kind"
        size="lg"
        block
        :kind="node.kind"
        class="mx-auto my-3 play-button py-2"
        @click="goToContent()"
      />
    </b-card>
  </b-link>
</template>

<script>
import { cardMixin } from 'eos-components';

export default {
  name: 'ContentImage',
  mixins: [cardMixin],
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  methods: {
    goToContent() {
      window.kolibri.navigateTo(this.node.id);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.card {
  box-shadow: $box-shadow;
}

a:hover {
  text-decoration: none;
}

</style>
