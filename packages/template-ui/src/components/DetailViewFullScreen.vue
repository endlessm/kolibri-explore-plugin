<template>
  <iframe
    ref="iframe"
    class="content-iframe"
    scrolling="no"
    frameBorder="0"
    :src="rooturl"
  >
  </iframe>
</template>

<script>
export default {
  name: 'DetailViewFullScreen',
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  computed: {
    rooturl() {
      if (!this.node) {
        return '';
      }

      const uri = window.location.search.substring(1);
      const params = new URLSearchParams(uri);
      return `/explore/#/content/${this.node.id}?${params.toString()}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

$main-container-top: $navbar-height;

.content-iframe {
  position: fixed;
  top: $main-container-top;
  width: 100%;
  height: 100vh;
}

</style>
