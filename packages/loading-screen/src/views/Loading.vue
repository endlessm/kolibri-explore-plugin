<template>
  <div class="d-flex flex-column flex-grow-1">
    <div
      id="main"
      class="align-items-center d-flex flex-column flex-grow-1 justify-content-center"
    >
      <img :src="loadingImage" class="mb-1">
      <div>
        <h1 class="text-primary">
          Welcome to Endless Key!
        </h1>
        <h4 class="font-weight-normal mt-3 text-muted">
          Please wait, this might take a few minutes.
        </h4>
      </div>
    </div>
    <div
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
