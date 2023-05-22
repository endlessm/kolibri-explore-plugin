<template>
  <WelcomeBase title="">
    <template #header-top>
      <div class="w-100">
        <img :src="loadingImage" class="mb-1" width="128">
      </div>
    </template>
  </WelcomeBase>
</template>

<script>
  import LoadingImage from 'ek-components/src/assets/loading-animation.gif';
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
