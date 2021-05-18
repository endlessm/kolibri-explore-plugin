<template>
  <div
    class="position-relative"
  >
    <b-icon
      icon="play-fill"
      variant="light"
      class="p-3 rounded-circle position-absolute"
      style=""
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
import cardMixin from '@/components/mixins/cardMixin';

export default {
  props: ['node'],
  mixins: [cardMixin],
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

$play-icon-size: 80px;

.b-icon {
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  width: $play-icon-size;
  height: $play-icon-size;
  background-color: rgba($dark, 0.8) !important;
}

</style>
