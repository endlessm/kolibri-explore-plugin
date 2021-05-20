<template>
  <b-container>
    <b-link
      :to="getNodeUrl(section)"
      class="text-decoration-none text-reset"
    >
      <h3>
        <span class="text-primary title">{{ section.title }} <b-icon-arrow-right /></span>
      </h3>
    </b-link>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'SectionTitle',
  props: {
    section: Object,
  },
  computed: {
    ...mapGetters(['getNodeUrl']),
  },
};
</script>
