import { mapState, mapGetters } from 'vuex';
import { utils } from 'ek-components';
import { headerLogoWidth } from '@/styles.scss';
import dynamicRequireAsset from '@/dynamicRequireAsset';

// FIXME remove this headerMixin entirely,
// because the NavBar and the Header don't share the asset anymore.
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
