<template>
  <b-jumbotron
    fluid
    :style="{ backgroundImage: headerImageURL }"
  >
    <template v-slot:default>
      <Breadcrumb :node="content" />
      <b-row class="mt-3">
        <b-col md="6" sm="12">
          <h3>{{ content.title }}</h3>
          <p class="mb-2">
            {{ getCardSubtitle(content) }}
          </p>
          <!-- eslint-disable vue/no-v-html -->
          <div class="mb-2" v-html="content.description"></div>
          <b-badge
            v-for="tag in subjectTags"
            :key="tag"
            pill
            variant="primary"
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
  name: 'Content',
  computed: {
    ...mapState(['content', 'section']),
    ...mapGetters(['getAssetURL', 'getCardSubtitle']),
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
