<template>
  <div>
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
    <CardGrid
      v-if="nextNodesInTopic.length"
      :nodes="nextNodesInTopic"
      :cardColumns="cardColumns"
      class="next-grid"
    >
      <h4 class="next-title text-dark text-truncate w-75">
        Next in {{ section.title }}
      </h4>
    </CardGrid>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { goToContent, trackEvent } from 'kolibri-api';
import { constants, utils } from 'eos-components';

export default {
  name: 'Content',
  computed: {
    ...mapState(['content', 'section', 'cardColumns', 'channel']),
    ...mapGetters(['nextNodesInTopic']),
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
  },
  mounted() {
    trackEvent('Content', 'load', this.content.id);
  },
  updated() {
    trackEvent('Content', 'load', this.content.id);
  },
  methods: {
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
