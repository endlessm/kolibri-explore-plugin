<template>
  <WelcomeBase title="">
    <template #header-top>
      <div class="w-100">
        <img :src="loadingImage" class="mb-1" width="128">
      </div>
    </template>
    <template #body>
      <h4 class="font-weight-normal text-muted">
        Please wait, this might take a few minutes.
      </h4>
    </template>
  </WelcomeBase>
</template>

<script>
  import LoadingImage from 'eos-components/src/assets/loading-animation.gif';
  import WelcomeBase from './WelcomeBase.vue';

  export default {
    name: 'Loading',
    components: {
      WelcomeBase,
    },
    data() {
      return {
        loadingImage: LoadingImage,
      };
    },
  };
</script>
