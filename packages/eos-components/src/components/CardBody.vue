<template>
  <div class="card-content">
    <h5 class="mb-1 title">
      <VClamp
        autoresize
        :maxLines="titleLines"
      >
        {{ node.title }}
      </VClamp>
    </h5>
    <div v-if="showChannelIcon" class="align-items-center d-flex mb-3">
      <ChannelLogo class="mr-2" :channel="node.channel" size="sm" />
      <span class="channel-title text-muted text-truncate">{{ node.channel.title }}</span>
    </div>
    <p v-else class="mb-1 subtitle text-muted text-truncate">
      {{ subtitle }}
    </p>
    <div v-if="showTags" class="mb-3 tags text-truncate">
      <b-badge
        v-for="tag in tags"
        :key="tag"
        pill
        variant="light"
        class="mr-1"
      >
        {{ tag }}
      </b-badge>
    </div>
  </div>
</template>

<script>
import VClamp from 'vue-clamp';
import { StructuredTags } from '../constants';
import { getAllStructuredTags, getFirstStructuredTag } from '../utils';

export default {
  name: 'CardBody',
  components: {
    VClamp,
  },
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
    subjectTags() {
      return getAllStructuredTags(this.node, StructuredTags.SUBJECT);
    },
    typeTag() {
      return getFirstStructuredTag(this.node, StructuredTags.TYPE);
    },
    gradeOrLevelTag() {
      return (
        getFirstStructuredTag(this.node, StructuredTags.GRADE)
        || getFirstStructuredTag(this.node, StructuredTags.LEVEL)
      );
    },
    tags() {
      const tags = [...this.subjectTags, this.typeTag, this.gradeOrLevelTag];
      return tags.filter(t => t !== null);
    },
    showChannelIcon() {
      return this.node.channel;
    },
    showTags() {
      return !this.showChannelIcon && this.tags.length;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles.scss';

.card-content {
  // FIXME this is aproximate, the function has regressed:
  height: card-body-height(2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.channel-title {
  font-family: $btn-font-family;
  font-size: $btn-font-size;
  font-weight: $btn-font-weight;
}

.subtitle {
  flex-grow: 3;
}
</style>
