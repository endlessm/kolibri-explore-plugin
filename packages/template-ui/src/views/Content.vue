<template>
  <div>
    <ChannelNavBar />
    <DetailView>
      <b-row class="mt-3">
        <b-col md="6" sm="12">
          <h1>{{ content.title }}</h1>
          <p class="mb-2">
            {{ subtitle }}
          </p>
          <!-- eslint-disable vue/no-v-html -->
          <div class="description mb-2" v-html="content.description"></div>
          <b-badge
            v-for="tag in tags"
            :key="tag"
            pill
            variant="light"
            class="mb-1 mr-1"
          >
            {{ tag }}
          </b-badge>
        </b-col>
        <b-col md="6" sm="12">
          <b-link
            @click="goToContent(content)"
          >
            <ContentImage :node="content" />
          </b-link>
        </b-col>
      </b-row>
    </DetailView>
    <template v-if="loading">
      <CardGridPlaceholder />
    </template>
    <template v-else>
      <CardGrid
        v-if="nextNodesInTopic.length"
        :nodes="nextNodesInTopic"
        :cardColumns="cardColumns"
        class="next-grid"
      >
        <h4 class="next-title text-dark text-truncate w-75">
          Next in {{ sectionTitle }}
        </h4>
      </CardGrid>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { goToContent } from 'kolibri-api';
import { constants, utils } from 'eos-components';

export default {
  name: 'Content',
  data() {
    return {
      content: {},
      nextNodesInTopic: [],
      loading: true,
    };
  },
  computed: {
    ...mapState(['cardColumns', 'channel']),
    tags() {
      return [
        ...utils.getAllStructuredTags(this.content, constants.StructuredTags.SUBJECT),
        ...utils.getAllStructuredTags(this.content, constants.StructuredTags.TYPE),
        ...utils.getAllStructuredTags(this.content, constants.StructuredTags.GRADE),
        ...utils.getAllStructuredTags(this.content, constants.StructuredTags.LEVEL),
      ];
    },
    subtitle() {
      return utils.getCardSubtitle(this.content, this.channel.title);
    },
    sectionTitle() {
      return this.content.ancestors[this.content.ancestors.length - 1].title;
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
    goToContent,
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

$big-spacer: $spacer * 3.5;

.next-grid {
  margin-top: $big-spacer !important;
}

</style>
