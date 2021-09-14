<template>
  <div>
    <ChannelNavBar :node="section" />
    <component
      :is="sectionVariant"
      :section="section"
      :sectionNodes="sectionNodes"
      :loading="loading"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ListSection from '@/views/ListSection';
import BundleSection from '@/views/BundleSection';

export default {
  name: 'Section',
  components: {
    ListSection,
    BundleSection,
  },
  data() {
    return {
      section: {},
      sectionNodes: [],
      loading: true,
    };
  },
  computed: {
    ...mapGetters([
      'isSimpleBundle',
    ]),
    showAsBundle() {
      if (!this.isSimpleBundle) {
        return false;
      }
      const hasChildTopics = this.sectionNodes.some((n) => n.kind === 'topic');
      return !hasChildTopics;
    },
    sectionVariant() {
      if (this.showAsBundle) {
        return 'BundleSection';
      }
      return 'ListSection';
    },
  },
  watch: {
    $route() {
      return this.fetchAll();
    },
  },
  mounted() {
    return this.fetchAll();
  },
  methods: {
    fetchAll() {
      this.loading = true;
      const { topicId } = this.$route.params;
      return window.kolibri.getContentById(topicId)
        .then((section) => {
          this.section = section;
          return this.fetchSectionNodes();
        })
        .then(() => {
          this.loading = false;
        });
    },
    fetchSectionNodes() {
      return window.kolibri.getContentByFilter({ parent: this.section.id })
        .then((page) => {
          this.sectionNodes = page.results;
        });
    },
  },
};
</script>
