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

export default {
  name: 'MainSections',
  computed: {
    ...mapState(['section', 'mainSection']),
    ...mapGetters(['mainSections', 'getNodeUrl']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';
</style>
