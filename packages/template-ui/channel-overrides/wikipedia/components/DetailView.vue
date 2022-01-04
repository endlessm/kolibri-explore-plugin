<template>
  <b-container class="main-container" fluid>
    <b-navbar class="header px-0" type="dark" variant="dark">
      <b-container fluid>
        <b-navbar-nav>
          <WikiBreadcrumb :items="breadcrumb" @click="onBreadCrumbClick" />
        </b-navbar-nav>
      </b-container>
    </b-navbar>

    <iframe
      ref="iframe"
      class="custom-presentation-iframe"
      scrolling="no"
      frameBorder="0"
      :style="styles"
      :src="rooturl"
      @load="onIframeLoad"
    >
    </iframe>
  </b-container>
</template>

<script>
export default {
  name: 'DetailView',
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      height: 0,
      breadcrumb: [],
    };
  },
  computed: {
    rooturl() {
      if (!this.node || !this.node.files || !this.node.files.length) {
        return '';
      }
      const [zimfile] = this.node.files.filter((f) => f.extension === 'zim');
      return `/zim/content/${zimfile.checksum}.zim`;
    },
    styles() {
      return {
        height: `${this.height}px`,
      };
    },
  },
  methods: {
    addBreadcrumb() {
      let { title } = this.$refs.iframe.contentDocument;
      const { href } = this.$refs.iframe.contentWindow.location;

      if (href === 'about:blank') {
        return;
      }

      const existingIndex = this.breadcrumb.findIndex((b) => b.href === href);
      if (existingIndex >= 0) {
        this.breadcrumb.splice(existingIndex);
      }

      if (this.breadcrumb.length === 0) {
        // We always assume the first breadcrumb is the home page. It has a
        // special title because the page title for the English Wikipedia
        // Zim file's index page is "User:The_other_Kiwix_guy/Landing".
        title = 'Home';
      }

      this.breadcrumb.push({ title, href });
    },
    onIframeLoad() {
      this.addBreadcrumb();

      // Set height to 0 and in the next tick set to the iframe body scrollHeight.
      // This is needed to adjust the content size when clicking on links,
      // because the body could have a "height: 100%" style and in that case the
      // height doesn't shrink.
      this.height = 0;
      window.scrollTo(0, 0);
      this.$nextTick(() => {
        this.height = this.$refs.iframe.contentWindow.document.body.scrollHeight;
      });
    },
    onBreadCrumbClick(link) {
      this.$refs.iframe.contentWindow.location = link.href;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

$main-container-top: $navbar-height;

.custom-presentation-iframe {
  width: 100%;
  height: 100vh;
}

.main-container {
  margin: $main-container-top 0 0 0;
  padding: 0;
}

</style>
