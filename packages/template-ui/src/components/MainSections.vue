<template>
  <b-button-toolbar key-nav aria-label="Sections">
    <b-button-group
      class="mx-1 my-1"
      v-for="section in mainSections"
      :key="'menu-' + section.id"
    >
    <b-button pill variant="primary"
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
  computed: {
    ...mapState(['section', 'mainSection']),
    ...mapGetters(['mainSections', 'getNodeUrl']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';
</style>
