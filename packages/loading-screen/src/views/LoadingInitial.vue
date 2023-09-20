<template>
  <LoadingBase
    :title="$formatMessage({
      id: 'welcomeTitle',
      defaultMessage: 'Welcome to Endless Key!',
      description: 'Title heading for the welcome page',
    })"
  >
    <template #header-top>
      <div class="w-100">
        <img :src="loadingImage" class="mb-1" width="128">
      </div>
    </template>
    <template #footer>
      <h5 class="small text-muted text-uppercase">
        {{ $formatMessage({
          id: 'poweredByKolibri',
          defaultMessage: 'Powered by Kolibri',
          description: 'Footer text to acknowledge that Endless Key is based on Kolibri',
        }) }}
      </h5>
      <img :src="kolibriImage" width="64">
    </template>
  </LoadingBase>
</template>

<script>
  import LoadingImage from '../assets/loading-animation.gif';
  import kolibriImage from '../assets/kolibri-logo.svg';
  import LoadingBase from './LoadingBase.vue';

  export default {
    name: 'LoadingInitial',
    components: {
      LoadingBase,
    },
    data() {
      return {
        loadingImage: LoadingImage,
        kolibriImage: kolibriImage,
      };
    },
  };
</script>
