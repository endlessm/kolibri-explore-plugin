<template>
  <div class="card-content">
    <p class="mb-1 text-info text-truncate text-uppercase">
      <span v-if="typeTag">{{ typeTag }}</span>
      <span v-if="typeTag && gradeOrLevelTag"> • </span>
      <span v-if="gradeOrLevelTag">{{ gradeOrLevelTag }}</span>
    </p>
    <h5 class="mb-1 title">
      <VClamp
        autoresize
        :maxLines="titleLines"
      >
        {{ node.title }}
      </VClamp>
    </h5>
    <p class="mb-1 subtitle text-muted text-truncate">
      {{ subtitle }}
    </p>
    <div class="tags">
      <b-badge
        v-for="tag in subjectTags"
        :key="tag"
        pill
        variant="primary"
        class="mb-1 mr-1"
      >
        {{ tag }}
      </b-badge>
    </div>
  </div>
</template>

<script>
import VClamp from 'vue-clamp';
import { mapGetters } from 'vuex';
import { StructuredTags } from '@/constants';

export default {
  name: 'CardBody',
  components: {
    VClamp,
  },
  props: {
    node: Object,
    titleLines: {
      type: Number,
      default: 3,
    },
    subtitle: String,
  },
  computed: {
    ...mapGetters({
      getStructuredTags: 'filters/getStructuredTags',
      getFirstStructuredTag: 'filters/getFirstStructuredTag',
    }),
    subjectTags() {
      return this.getStructuredTags(this.node, StructuredTags.SUBJECT);
    },
    typeTag() {
      return this.getFirstStructuredTag(this.node, StructuredTags.TYPE);
    },
    gradeOrLevelTag() {
      return (
        this.getFirstStructuredTag(this.node, StructuredTags.GRADE)
        || this.getFirstStructuredTag(this.node, StructuredTags.LEVEL)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.card-content {
  min-height: card-body-height(3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.subtitle {
  flex-grow: 3;
}
</style>
