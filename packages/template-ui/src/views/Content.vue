<template>
  <b-jumbotron fluid
    :style="{ backgroundImage: headerImageURL }"
  >
    <template v-slot:default>
      <Breadcrumb :node="content" />
      <b-row class="mt-3">
        <b-col md="6" sm="12">
          <h3>{{ content.title }}</h3>
          <p class="mb-2">{{ getCardSubtitle(content) }}</p>
          <div class="mb-2" v-html="content.description" />
          <b-badge
            pill variant="primary"
            class="mr-1 mb-1"
            v-for="tag in subjectTags"
            :key="tag"
          >
            {{ tag }}
          </b-badge>
        </b-col>
        <b-col md="6" sm="12">
          <b-link
            v-on:click="goToContent(content)"
          >
            <ContentImage :node="content" />
          </b-link>
        </b-col>
      </b-row>
    </template>
  </b-jumbotron>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { goToContent } from 'kolibri-api';
import dynamicRequireAsset from '@/dynamicRequireAsset';
import { getSlug } from '@/utils';
import { StructuredTags } from '@/constants';

export default {
  computed: {
    ...mapState(['content', 'section']),
    ...mapGetters(['headerDescription', 'getAssetURL', 'getCardSubtitle']),
    ...mapGetters({ getStructuredTags: 'filters/getStructuredTags' }),
    subjectTags() {
      return this.getStructuredTags(this.content, StructuredTags.SUBJECT);
    },
    sectionImageURL() {
      if (!this.section || !this.section.title) {
        return null;
      }
      const sectionSlug = this.getSlug(this.section.title);
      const headerSectionFilename = `header-${sectionSlug}.jpg`;
      const headerSectionAsset = dynamicRequireAsset(headerSectionFilename);
      if (headerSectionAsset) {
        return `url(${headerSectionAsset})`;
      }
      return null;
    },
    headerImageURL() {
      return this.sectionImageURL || this.getAssetURL('headerImage');
    },
  },
  methods: {
    getSlug,
    goToContent,
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.jumbotron {
  background-color: $body-bg;
  background-size: cover;
}

</style>
