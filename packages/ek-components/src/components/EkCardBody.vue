<template>
  <div class="card-content">

    <!-- FIXME only for debugging: -->
    <span class="debug-node-id sr-only">{{ node.id }}</span>

    <!-- Channel -->
    <div v-if="showChannelIcon">
      <div class="d-flex mb-3">
        <EkChannelLogo class="mr-2" :channel="node.channel" size="sm" />
        <span class="channel-title text-muted text-truncate">{{ node.channel.title }}</span>
      </div>
    </div>

    <!-- Title -->
    <div>
      <h5
        class="mb-1 title"
        :class="{ 'text-muted': !node.available }"
      >
        <EkClamp
          :maxLines="titleLines"
          :text="node.title"
        />
      </h5>
    </div>

    <!-- Description -->
    <div v-if="!showChannelIcon">
      <p class="mb-1 subtitle text-muted">
        <EkClamp
          :maxLines="3"
          :text="subtitle"
        />
      </p>
    </div>

  </div>
</template>

<script>

export default {
  name: 'EkCardBody',
  props: {
    node: {
      type: Object,
      required: true,
    },
    titleLines: {
      type: Number,
      default: 3,
    },
    subtitle: {
      type: String,
      default: '',
    },
  },
  computed: {
    showChannelIcon() {
      return this.node.channel;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles.scss';

.card-content {
  // FIXME this is aproximate, the function has regressed:
  height: card-body-height(2);
}

.channel-title {
  font-family: $btn-font-family;
  font-size: $btn-font-size;
  font-weight: $btn-font-weight;
}

.subtitle {
  line-height: 1.1;
}
</style>
