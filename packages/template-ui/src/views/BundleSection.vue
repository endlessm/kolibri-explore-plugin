<template>
  <div>
    <DetailView
      :title="section.title"
      :subtitle="subtitle"
    >
      <!-- eslint-disable vue/no-v-html -->
      <div class="description mb-2" v-html="section.description"></div>
      <b-row class="mt-3">
        <b-col
          v-for="content in sectionNodes.nodes"
          :key="content.id"
          class="content-col"
          md="3"
          sm="12"
        >
          <b-link
            @click="goToContent(content)"
          >
            <ContentImage :node="content" />
            <p class="h6 mt-2 text-center text-dark">
              {{ content.title }}
            </p>
          </b-link>
        </b-col>
      </b-row>
    </DetailView>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { utils } from 'eos-components';

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
    goToContent(node) {
      window.kolibri.navigateTo(node.id);
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
