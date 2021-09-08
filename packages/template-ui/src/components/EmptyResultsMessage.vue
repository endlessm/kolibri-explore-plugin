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
    <CardGrid
      v-if="showTopics"
      :nodes="mainSections"
      :mediaQuality="mediaQuality"
      :cardColumns="cardColumns"
    >
      <h3>Explore topics</h3>
    </CardGrid>
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
