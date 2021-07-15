<template>
  <div
    id="app"
    class="align-items-center d-flex flex-column justify-content-center text-center vh-100"
  >
    <div class="loading">
      <img :src="loadingImage" class="mb-1">
      <h1 class="text-primary">
        Welcome to the Endless Key Discovery
      </h1>
      <h4 class="font-weight-normal mt-3 text-muted">
        Please, wait a moment while it loads
      </h4>
    </div>
    <div class="fixed-bottom kolibri mb-5 text-muted">
      <h5>Powered by Kolibri</h5>
      <img :src="kolibriImage">
    </div>
  </div>
</template>

<script>

import LoadingImage from 'eos-components/src/assets/loading-animation.gif';
import kolibriImage from './assets/kolibri-logo.svg';

export default {
  name: 'App',
  data() {
    return {
      loadingImage: LoadingImage,
      kolibriImage: kolibriImage,
    };
  },
};
</script>

<style lang="scss">
@import '@/index.scss';

html {
  height: 100%;
}
/* Always show the vertical scrollbar */
body {
  overflow: hidden;
  min-height: 100vh;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

.kolibri h5 {
  text-transform: uppercase !important;
  font-size: small;
}

.kolibri img {
  width: 64px;
}

.loading img {
  max-width: 128px;
}

</style>
