<template>
  <WelcomeBase title="Welcome to Endless Key!">
    <template #header-top>
      <div class="w-100">
        <img :src="loadingImage" class="mb-1" width="128">
      </div>
    </template>
    <template #footer>
      <h5 class="small text-muted text-uppercase">
        Powered by Kolibri
      </h5>
      <img :src="kolibriImage" width="64">
    </template>
  </WelcomeBase>
</template>

<script>
  import LoadingImage from 'ek-components/src/assets/loading-animation.gif';
  import kolibriImage from '../assets/kolibri-logo.svg';
  import WelcomeBase from './WelcomeBase.vue';

  export default {
    name: 'LoadingInitial',
    components: {
      WelcomeBase,
    },
    data() {
      return {
        loadingImage: LoadingImage,
        kolibriImage: kolibriImage,
      };
    },
  };
</script>
