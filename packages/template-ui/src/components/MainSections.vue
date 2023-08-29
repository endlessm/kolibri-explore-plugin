<template>
  <b-button-toolbar keyNav :aria-label="$tr('sectionsLabel')">
    <b-button-group
      v-for="section in mainSections"
      :key="'menu-' + section.id"
      size="sm"
      class="mx-1 my-1"
    >
      <b-button
        pill
        size="sm"
        variant="primary"
        :to="getNodeUrl(section)"
      >
        {{ section.title }}
      </b-button>
    </b-button-group>
    <slot>
    </slot>
  </b-button-toolbar>
</template>

<script>
import { mapState } from 'vuex';
import { utils } from 'ek-components';

export default {
  name: 'MainSections',
  computed: {
    ...mapState(['mainSections', 'channel']),
  },
  methods: {
    getNodeUrl(node) {
      return utils.getNodeUrl(node, this.channel.id);
    },
  },
  $trs: {
    sectionsLabel: {
      message: 'Sections',
      context: 'Accessibility label for the list of main sections',
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

/*
 * This ensures the text of the pills are vertically centered. This
 * is not generalizable to other pill-like buttons.
 */
a.btn.rounded-pill {
  display: flex;
  align-self: baseline;
}

</style>
