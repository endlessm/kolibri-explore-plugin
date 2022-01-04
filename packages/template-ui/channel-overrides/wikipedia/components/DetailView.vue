<template>
  <iframe
    ref="iframe"
    class="custom-presentation-iframe"
    scrolling="no"
    frameBorder="0"
    :style="styles"
    :src="rooturl"
    @load="adjustIframeHeightOnLoad"
  >
  </iframe>
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
    adjustIframeHeightOnLoad() {
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
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

$main-container-top: $navbar-height;

.custom-presentation-iframe {
  width: 100%;
  height: 100vh;
  margin-top: $main-container-top;
}

</style>
