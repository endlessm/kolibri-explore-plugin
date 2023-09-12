<template>
  <div>
    <b-container class="my-3">
      <b-row>
        <b-col cols="7">
          <slot>
            <h1 class="text-secondary">
              There are no results containing all of your filter options.
            </h1>
            <h5 class="text-muted">
              You can try fewer filter options, different filter options, or explore
              the topics below.
            </h5>
          </slot>
        </b-col>
      </b-row>
    </b-container>
    <EkCardGrid
      v-if="showTopics"
      :nodes="mainSections"
      :mediaQuality="mediaQuality"
      :cardColumns="cardColumns"
    >
      <b-row>
        <b-container>
          <h4 class="explore-title text-dark text-truncate w-75">
            Explore topics
          </h4>
        </b-container>
      </b-row>
    </EkCardGrid>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'EmptyResultsMessage',
    props: {
      showTopics: {
        type: Boolean,
        default: true,
      },
    },
    computed: {
      ...mapState(['mainSections', 'cardColumns', 'mediaQuality']),
    },
  };
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.explore-title {
  margin-top: $big-spacer !important;
}

</style>
