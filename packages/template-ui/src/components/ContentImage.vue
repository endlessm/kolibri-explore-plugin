<template>
  <div
    class="position-relative"
  >
    <PlayButton
      :kind="node.kind"
      class="play-button position-absolute"
      @click="goToContent()"
    />
    <b-img
      fluid
      :src="thumbnail"
      :alt="node.title"
      class="border d-block mx-auto rounded"
    />
  </div>
</template>

<script>
import { cardMixin } from 'eos-components';

export default {
  name: 'ContentImage',
  mixins: [cardMixin],
  props: {
    node: Object,
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

.play-button {
  top: 50% !important;
  left: 50% !important;
  position: absolute !important;
  transform: translate(-50%,-50%) !important;
}

</style>
