import { mapState, mapGetters } from 'vuex';
import { headerLogoWidth } from '@/styles.scss';
import { getSlug } from '@/utils';
import dynamicRequireAsset from '@/dynamicRequireAsset';

export default {
  data() {
    return {
      headerLogoWidth,
    };
  },
  computed: {
    ...mapState(['channel', 'section']),
    ...mapGetters(['getAssetURL']),
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
    hasHeaderImage() {
      return this.headerImageURL !== null;
    },
  },
  methods: {
    getSlug,
  },
};
