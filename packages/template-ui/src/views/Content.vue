<template>
  <div>
    <ChannelNavBar />
    <b-jumbotron
      fluid
      :style="{ backgroundImage: headerImageURL }"
    >
      <template v-slot:default>
        <b-row class="mt-3">
          <b-col md="6" sm="12">
            <h3>{{ content.title }}</h3>
            <p class="mb-2">
              {{ subtitle }}
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
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { goToContent } from 'kolibri-api';
import dynamicRequireAsset from '@/dynamicRequireAsset';
import { getSlug } from '@/utils';
import { constants, utils } from 'eos-components';

export default {
  name: 'Content',
  computed: {
    ...mapState(['content', 'section', 'channel']),
    ...mapGetters(['getAssetURL']),
    subjectTags() {
      return this.content.structuredTags[constants.StructuredTags.SUBJECT];
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
    subtitle() {
      return utils.getCardSubtitle(this.content, this.channel.title);
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
  padding-top: $navbar-height;
}

</style>
