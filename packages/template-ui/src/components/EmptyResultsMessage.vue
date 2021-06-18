<template>
  <div>
    <b-container class="my-3">
      <b-row>
        <b-col cols="7">
          <slot>
            <h1 class="text-secondary">
              There are no results containing all your filter options.
            </h1>
            <h5>
              You can try different filter options, clear your filters or explore
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
  import { mapGetters, mapState } from 'vuex';

  export default {
    name: 'EmptyResultsMessage',
    props: {
      showTopics: {
        type: Boolean,
        default: true,
      },
    },
    computed: {
      ...mapGetters(['mainSections']),
      ...mapState(['cardColumns', 'mediaQuality']),
    },
  };
</script>
