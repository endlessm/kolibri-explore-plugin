<template>
  <div>
    <DetailView
      :title="section.title"
      :subtitle="subtitle"
    >
      <b-row class="mt-3">
        <b-col
          v-for="content in sectionNodes.nodes"
          :key="content.id"
          class="content-col"
          sm="6"
          xs="12"
        >
          <ContentImage :node="content" />
          <p class="h6 mt-2 text-center text-dark">
            {{ content.title }}
          </p>
        </b-col>
      </b-row>

      <!-- eslint-disable vue/no-v-html -->
      <div class="description mb-2 w-50" v-html="section.description"></div>

      <div v-if="section.license_description" id="license" class="my-3 text-muted">
        <strong>{{ $tr('licenseHeading', { license_name: section.license_name }) }}</strong>
        <p> {{ section.license_description }} </p>
      </div>

    </DetailView>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { utils } from 'ek-components';

export default {
  name: 'BundleSection',
  props: {
    section: {
      type: Object,
      required: true,
    },
    sectionNodes: {
      type: Object,
      default() {
        return { nodes: [], hasMoreNodes: false };
      },
    },
    // FIXME use the loading prop:
    // loading: Boolean,
  },
  computed: {
    ...mapState(['channel']),
    subtitle() {
      const bundle = {
        ...this.section,
        // Adding section nodes to calculate the number of resources
        children: this.sectionNodes.nodes,
      };
      return utils.getCardSubtitle(bundle, this.channel.name);
    },
  },
  watch: {
    sectionNodes() {
      this.loadBundle();
    },
  },
  mounted() {
    this.loadBundle();
  },
  methods: {
    loadBundle() {
      // Load all nodes
      if (this.sectionNodes.hasMoreNodes) {
        this.$emit('loadMoreNodes');
      }
    },
  },
  $trs: {
    licenseHeading: {
      message: 'License — {license_name}',
      context: 'Heading for the license of a bundle',
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.content-col {
  margin-bottom: $grid-gutter-width;
}

</style>
