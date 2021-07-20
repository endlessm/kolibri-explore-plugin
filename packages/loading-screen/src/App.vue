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
      <h4
        v-if="!isError"
        class="font-weight-normal mt-3 text-muted"
      >
        Please, wait a moment while it loads
      </h4>
      <p v-if="isRetry">
        Could not start Kolibri. Trying again...
      </p>
      <div v-if="isError">
        <h4 class="mt-3 text-danger">
          Could not start Kolibri
        </h4>
        <p class="text-muted">
          Try restarting Kolibri or contact us for support.
          <br>
          <a href="https://community.endlessos.com/">
            Ask for help on our community forums
          </a>
        </p>
      </div>
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
      state: 'default',
      firstLaunch: false,
    };
  },
  computed: {
    isError() {
      return this.state === 'error';
    },
    isRetry() {
      return this.state === 'retry';
    },
  },
  mounted() {
    window.show_retry = () => {
      this.setState('retry');
    }

    window.show_error = () => {
      this.setState('error');
    }

    window.clean = () => {
      this.setState('default');
    }

    window.firstLaunch = () => {
      this.setFirstLaunch(true);
    }
  },
  beforeDestroy() {
    function fallback() {
      console.log('No loading screen');
    };
    window.show_retry = fallback;
    window.show_error = fallback;
    window.clean = fallback;
    window.firstLaunch = fallback;
  },
  methods: {
    setState(state) {
      this.state = state;
    },
    setFirstLaunch(value) {
      this.firstLaunch = value;
    },
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
