<template>
  <div
    class="position-relative"
  >
    <PlayButton
      :node="node"
      class="play-button position-absolute"
    />
    <b-img
      fluid
      :src="thumbnail"
      :alt="node.title"
      class="rounded w-100"
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
