<template>
  <b-container>
    <b-link
      :to="nodeUrl"
      class="text-decoration-none text-reset"
    >
      <h5>
        <span class="text-primary title">{{ section.title }} <ArrowRightIcon /></span>
      </h5>
    </b-link>
  </b-container>
</template>

<script>
import { utils } from 'ek-components';
import { mapState } from 'vuex';
import ArrowRightIcon from 'vue-material-design-icons/ArrowRight.vue';

export default {
  name: 'SectionTitle',
  components: { ArrowRightIcon },
  props: {
    section: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState(['channel']),
    nodeUrl() {
      return utils.getNodeUrl(this.section, this.channel.id);
    },
  },
};
</script>
