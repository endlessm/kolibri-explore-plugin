<template>
  <div>
    <div class="p-3 pb-5">
      <h1 class="text-primary">
        Permission
      </h1>

      <b-container class="inner-container">
        <h5 class="font-weight-normal text-muted">
          The Endless Key needs your Permission to access files on your device.
        </h5>

        <img class="mt-4 w-100" :src="permissionsImage">

        <b-button
          class="mt-5"
          variant="primary"
          @click="openSystemPermission"
        >
          Grant Permission
        </b-button>
      </b-container>
    </div>
  </div>
</template>


<script>
  import PermissionsImage from '../assets/permissions-explanation.gif';

  export default {
    name: 'PermissionsExplanation',
    data() {
      return {
        permissionsImage: PermissionsImage,
      };
    },
    methods: {
      openSystemPermission() {
        this.$router.replace('/loading/default');
        window.EndlessAPI.openSystemPermission();
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  // We need a custom container for the paragraph and the image:
  .inner-container {
    @include media-breakpoint-up(md) {
      max-width: $inner-container-max-width;
    }
  }

</style>
