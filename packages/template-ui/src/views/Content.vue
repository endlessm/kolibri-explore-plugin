<template>
  <div>
    <ChannelNavBar :node="content" />
    <component
      :is="detailVariant"
      :title="content.title"
      :subtitle="subtitle"
      :node="content"
    >
      <ContentImage :node="content" />

      <!-- eslint-disable vue/no-v-html -->
      <div class="description mt-5 text-muted" v-html="content.description"></div>

      <b-badge
        v-for="tag in tags"
        :key="tag"
        pill
        variant="light"
        class="mb-1 mr-1"
      >
        {{ tag }}
      </b-badge>

      <div v-if="content.license_description" id="license" class="my-3 text-muted">
        <strong>{{ $tr('licenseHeading', { license_name: content.license_name }) }}</strong>
        <p> {{ content.license_description }} </p>
      </div>
    </component>
    <template v-if="loading">
      <EkCardGridPlaceholder />
    </template>
    <template v-else>
      <EkCardGrid
        v-if="nextNodesInTopic.length && showNextContent"
        :nodes="nextNodesInTopic"
        :cardColumns="cardColumns"
        class="next-grid"
        @nodeUpdated="onNextNodesUpdated"
      >
        <b-container>
          <h4 class="next-title text-dark text-truncate w-75">
            {{ $tr('nextIn', { name: sectionTitle }) }}
          </h4>
        </b-container>
      </EkCardGrid>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { constants, utils } from 'ek-components';
import updateNodeMixin from '@/mixins/updateNodeMixin';

export default {
  name: 'Content',
  mixins: [updateNodeMixin],
  data() {
    return {
      content: {},
      nextNodesInTopic: [],
      loading: true,
    };
  },
  computed: {
    ...mapState(['cardColumns', 'channel', 'showNextContent', 'showDetailViewFullScreen']),
    tags() {
      return [
        ...utils.getAllStructuredTags(this.content, constants.StructuredTags.SUBJECT),
        ...utils.getAllStructuredTags(this.content, constants.StructuredTags.TYPE),
        ...utils.getAllStructuredTags(this.content, constants.StructuredTags.GRADE),
        ...utils.getAllStructuredTags(this.content, constants.StructuredTags.LEVEL),
      ];
    },
    subtitle() {
      return utils.getCardSubtitle(this.content, this.channel.name);
    },
    sectionTitle() {
      return this.content.ancestors[this.content.ancestors.length - 1].title;
    },
    detailVariant() {
      if (this.showDetailViewFullScreen) {
        return 'DetailViewFullScreen';
      }

      return 'DetailView';
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
      const { contentId } = this.$route.params;
      return window.kolibri.getContentById(contentId)
        .then((content) => {
          this.content = content;
          return this.fetchNextNodesInTopic();
        })
        .then(() => {
          this.loading = false;
        });
    },
    fetchNextNodesInTopic() {
      const currentOrder = this.content.sort_order;
      return window.kolibri.getContentByFilter({ parent: this.content.parent })
        .then((page) => {
          // FIXME query by sort order > current order:
          this.nextNodesInTopic = page.results.filter((node) => node.sort_order > currentOrder);
        });
    },
    onNextNodesUpdated(nodeId) {
      return this.onNodeUpdated(nodeId, this.nextNodesInTopic);
    }
  },
  $trs: {
    licenseHeading: {
      message: 'License — {license_name}',
      context: 'Heading for the license of a bundle',
    },
    nextIn: {
      message: 'Next in {name}',
      context: 'Heading for the next part of a grid of content; {name} is a section name',
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.next-grid {
  margin-top: $big-spacer !important;
}

</style>
