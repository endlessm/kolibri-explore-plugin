<template>
  <div>
    <b-container class="my-3">
      <b-row>
        <b-col cols="7">
          <slot>
            <h1 class="text-secondary">
              {{ $tr('noResults') }}
            </h1>
            <h5 class="text-muted">
              {{ $tr('noResultsGuidance') }}
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
            {{ $tr('exploreTopics') }}
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
    $trs: {
      noResults: {
        message: 'There are no results containing all of your filter options.',
        context: 'Page content shown when there are no filter results',
      },
      noResultsGuidance: {
        message: 'You can try fewer filter options, different filter options, or explore the topics below.',
        context: 'Guidance shown to help the user work out what to do next when no filter results are found',
      },
      exploreTopics: {
        message: 'Explore topics',
        context: 'Heading shown when there are no filter results',
      },
    },
  };
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.explore-title {
  margin-top: $big-spacer !important;
}

</style>
