<template>
  <div class="card-content">
    <p class="text-uppercase text-info mb-1 text-truncate">
      <span v-if="typeTag">{{ typeTag }}</span>
      <span v-if="typeTag && gradeOrLevelTag"> • </span>
      <span v-if="gradeOrLevelTag">{{ gradeOrLevelTag }}</span>
    </p>
    <h5 class="title mb-1">
      <v-clamp
        autoresize
        :max-lines="titleLines"
      >
        {{ node.title }}
      </v-clamp>
    </h5>
    <p class="subtitle text-muted mb-1 text-truncate">
      {{ getCardSubtitle(node) }}
    </p>
    <div class="tags">
      <b-badge
        pill variant="primary"
        class="mr-1 mb-1"
        v-for="tag in subjectTags"
        :key="tag"
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
  props: {
    node: Object,
    titleLines: {
      type: Number,
      default: 3,
    },
  },
  components: {
    VClamp,
  },
  computed: {
    ...mapGetters(['getCardSubtitle']),
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
