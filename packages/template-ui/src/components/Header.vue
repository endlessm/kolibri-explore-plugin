<template>
  <b-jumbotron fluid
    :style="{ backgroundImage: headerImageURL }"
    class="mb-0"
  >
    <template v-slot:default>
      <Breadcrumb :node="section" />
      <div class="d-flex justify-content-between align-items-start mt-3">
      <h1>{{ section.title }}</h1>
      <b-img
        class="rounded-lg"
        :width="headerLogoWidth"
        v-if="displayLogoInHeader && channel.thumbnail"
        :src="channel.thumbnail"
      />
      </div>
      <b-row>
        <b-col md="6" sm="12">
          <div class="lead text-muted mb-2">{{ headerDescription }}</div>
        </b-col>
      </b-row>
    </template>
  </b-jumbotron>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import dynamicRequireAsset from '@/dynamicRequireAsset';
import { headerLogoWidth } from '@/styles.scss';
import { getSlug } from '@/utils';

export default {
  data() {
    return {
      headerLogoWidth,
    };
  },
  computed: {
    ...mapState(['channel', 'section', 'displayLogoInHeader']),
    ...mapGetters(['headerDescription', 'getAssetURL']),
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
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

// FIXME this will be the secondary color instead of a custom color derived from the success color.
// Waiting for the change in Figma.
$header-color: rgba($success, 0.5);

.jumbotron {
  background-color: $header-color;
  background-size: cover;
}

img {
  box-shadow: $toast-box-shadow;
}

</style>
