<template>
  <b-button-toolbar keyNav aria-label="Sections">
    <b-button-group
      v-for="section in mainSections"
      :key="'menu-' + section.id"
      class="mx-1 my-1"
    >
      <b-button
        pill
        variant="primary"
        :to="getNodeUrl(section)"
        :active="section.id === mainSection.id"
      >
        {{ section.title }}
      </b-button>
    </b-button-group>
  </b-button-toolbar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { utils } from 'eos-components';

export default {
  name: 'MainSections',
  computed: {
    ...mapState(['section', 'mainSection', 'channel']),
    ...mapGetters(['mainSections']),
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
