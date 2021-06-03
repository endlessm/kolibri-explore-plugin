<template>
  <b-container>
    <b-link
      :to="nodeUrl"
      class="text-decoration-none text-reset"
    >
      <h3>
        <span class="text-primary title">{{ section.title }} <b-icon-arrow-right /></span>
      </h3>
    </b-link>
  </b-container>
</template>

<script>
import { utils } from 'eos-components';
import { mapState } from 'vuex';

export default {
  name: 'SectionTitle',
  props: {
    section: Object,
  },
  computed: {
    ...mapState(['channel']),
    nodeUrl() {
      return utils.getNodeUrl(this.section, this.channel.id);
    },
  },
};
</script>
