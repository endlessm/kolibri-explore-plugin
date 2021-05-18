<template>
<b-container>
  <b-link
    :to="getNodeUrl(section)"
    class="text-reset text-decoration-none"
  >
    <h3>
      <span class="title text-primary" >{{ section.title }} <b-icon-arrow-right /></span>
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
