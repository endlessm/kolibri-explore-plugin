<template>
  <div>
    <div class="loading">
      <img v-if="isLoading" :src="loadingImage" class="mb-1">
      <b-icon-exclamation-circle v-if="!isLoading" variant="dark" fontScale="4" class="mb-3" />
      <div v-if="isError">
        <h1 class="text-danger">
          Could not start Endless Key
        </h1>
        <h4 class="font-weight-normal mt-3 text-muted">
          Please, try restarting the Endless Key by closing this window and
          double clicking the launcher again.
          <br>
          <br>
          More information on the <a :href="guideURL">Quick Start Guide</a>
        </h4>
      </div>
      <div v-else-if="isRetry">
        <h1 class="text-dark">
          Could not start Endless Key
        </h1>
        <h4 class="font-weight-normal mt-3 text-secondary">
          Trying again...
        </h4>
      </div>
      <div v-else>
        <h1 class="text-primary">
          Welcome to the Endless Key
        </h1>
        <h4 class="font-weight-normal mt-3 text-muted">
          Please wait a moment while your discovery experience loads
        </h4>
      </div>
    </div>

    <div v-if="isLoading" class="fixed-bottom kolibri mb-5 text-muted">
      <h5>Powered by Kolibri</h5>
      <img :src="kolibriImage">
    </div>
  </div>
</template>

<script>

import LoadingImage from 'eos-components/src/assets/loading-animation.gif';
import kolibriImage from '../assets/kolibri-logo.svg';

export default {
  name: 'Loading',
  data() {
    return {
      loadingImage: LoadingImage,
      kolibriImage: kolibriImage,
    };
  },
  computed: {
    state() {
      return this.$route.params.state;
    },
    isError() {
      return this.state === 'error';
    },
    isRetry() {
      return this.state === 'retry';
    },
    isLoading() {
      return this.state === 'default';
    },
    guideURL() {
      // This is the path for the guide in the Endless Key
      // The loading screen index is on:
      // D:\KOLIBRI_DATA\extensions\kolibri-explore-plugin\loadingScreen\index.html
      //
      // So we have four levels to go to the root, that's where the Guide PDF
      // is placed.
      return '../../../../Endless Key Quick Start.pdf';
    },
  },
};
</script>

<style lang="scss">
@import '@/index.scss';

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
