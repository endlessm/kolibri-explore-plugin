<template>
  <b-button-toolbar keyNav aria-label="Sections">
    <b-button-group
      v-for="section in mainSectionsSorted"
      :key="'menu-' + section.id"
      class="mx-1 my-1"
    >
      <b-button
        pill
        variant="primary"
        :to="getNodeUrl(section)"
      >
        {{ section.title }}
      </b-button>
    </b-button-group>
  </b-button-toolbar>
</template>

<script>
import { mapState } from 'vuex';
import { utils } from 'eos-components';
import _ from 'underscore';

export default {
  name: 'MainSections',
  computed: {
    ...mapState(['mainSections', 'channel']),
    mainSectionsSorted() {
      return _.sortBy(this.mainSections, 'title');
    },
  },
  methods: {
    getNodeUrl(node) {
      return utils.getNodeUrl(node, this.channel.id);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';
</style>
