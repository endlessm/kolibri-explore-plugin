<template>
  <div
    class="position-relative"
  >
    <PlayButton
      :kind="node.kind"
      class="play-button position-absolute"
      @click="goToContent(node)"
    />
    <b-img
      :src="thumbnail"
      :alt="node.title"
      class="d-block mx-auto rounded"
    />
  </div>
</template>

<script>
import { goToContent } from 'kolibri-api';
import { cardMixin } from 'eos-components';

export default {
  name: 'ContentImage',
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

.play-button {
  top: 50% !important;
  left: 50% !important;
  position: absolute !important;
  transform: translate(-50%,-50%) !important;
}

</style>
