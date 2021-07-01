<template>
  <div>
    <b-container class="main-container">
      <b-row class="mt-3">
        <b-col md="6" sm="12">
          <h3>{{ content.title }}</h3>
          <p class="mb-2">
            {{ subtitle }}
          </p>
          <!-- eslint-disable vue/no-v-html -->
          <div class="description mb-2" v-html="content.description"></div>
          <b-badge
            v-for="tag in subjectTags"
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
    </b-container>
    <CardGrid
      v-if="nextNodesInTopic.length"
      :nodes="nextNodesInTopic"
      :cardColumns="cardColumns"
    >
      <b-row>
        <h3>Next in {{ section.title }}:</h3>
      </b-row>
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
    subjectTags() {
      return this.content.structuredTags[constants.StructuredTags.SUBJECT];
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

<style lang="scss" scoped>
@import '@/styles.scss';

.main-container {
  background-color: $white;
  background-size: cover;
  padding-top: $navbar-height;
}

</style>
