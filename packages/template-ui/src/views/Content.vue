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
      class="my-grid"
    >
      <h4 class="next-title text-dark">
        Next in {{ section.title }}
      </h4>
    </CardGrid>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { goToContent } from 'kolibri-api';
import { constants, utils } from 'eos-components';

export default {
  name: 'Content',
  computed: {
    ...mapState(['content', 'section', 'cardColumns', 'channel']),
    ...mapGetters(['nextNodesInTopic']),
    tags() {
      return [
        ...this.content.structuredTags[constants.StructuredTags.SUBJECT],
        ...this.content.structuredTags[constants.StructuredTags.TYPE],
        ...this.content.structuredTags[constants.StructuredTags.GRADE],
        ...this.content.structuredTags[constants.StructuredTags.LEVEL],
      ];
    },
    subtitle() {
      return utils.getCardSubtitle(this.content, this.channel.title);
    },
  },
  methods: {
    goToContent,
  },
};
</script>
