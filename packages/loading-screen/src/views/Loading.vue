<template>
  <div class="d-flex flex-column flex-grow-1">
    <div
      id="main"
      class="align-items-center d-flex flex-column flex-grow-1 justify-content-center"
    >
      <img v-if="isLoading" :src="loadingImage" class="mb-1">
      <b-icon-exclamation-circle v-if="!isLoading" variant="dark" fontScale="4" class="mb-3" />
      <div v-if="isError">
        <h1 class="text-danger">
          Could not start Endless Key
        </h1>
        <h4 class="font-weight-normal mt-3 text-muted">
          Please, try restarting the Endless Key by closing this window and
          double clicking the launcher again.
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
    <div
      v-if="isLoading"
      id="footer"
      class="mb-5 text-muted"
    >
      <h5 class="small text-uppercase">
        Powered by Kolibri
      </h5>
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
  },
};
</script>

<style lang="scss">
@import '@/index.scss';

#main img {
  width: 128px;
}

#footer img {
  width: 64px;
}

</style>
