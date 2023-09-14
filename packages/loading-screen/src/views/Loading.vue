<template>
  <LoadingBase title="">
    <template #header-top>
      <div class="w-100">
        <img :src="loadingImage" class="mb-1" width="128">
      </div>
    </template>
  </LoadingBase>
</template>

<script>
  import LoadingImage from '../assets/loading-animation.gif';
  import LoadingBase from './LoadingBase.vue';

  export default {
    name: 'Loading',
    components: {
      LoadingBase,
    },
    data() {
      return {
        loadingImage: LoadingImage,
      };
    },
  };
</script>
