import { mapState, mapGetters } from 'vuex';
import { headerLogoWidth } from '@/styles.scss';
import { utils } from 'eos-components';
import dynamicRequireAsset from '@/dynamicRequireAsset';

export default {
  data() {
    return {
      headerLogoWidth,
    };
  },
  computed: {
    ...mapState(['channel']),
    ...mapGetters(['getAssetURL']),
    sectionImageURL() {
      if (!this.section || !this.section.title) {
        return null;
      }
      const sectionSlug = utils.getSlug(this.section.title);
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
};
