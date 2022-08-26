<template>
  <div>
    <div class="p-3 pb-5">
      <h1 class="text-primary">
        Folder selection cancelled
      </h1>

      <b-container class="inner-container">
        <h5 class="font-weight-normal text-muted">
          Please make sure to select the "KOLIBRI_DATA" folder in your external device.
        </h5>

        <b-button
          class="mt-5"
          variant="primary"
          @click="loadWithUSB"
        >
          Allow Access
        </b-button>
        <br>
        <b-button
          class="mt-5"
          variant="primary"
          to="select-source"
        >
          Download choices
        </b-button>
      </b-container>
    </div>
  </div>
</template>


<script>
  export default {
    name: 'PermissionsCancelled',
    methods: {
      loadWithUSB() {
        this.$router.replace('/loading/default');
        window.EndlessAPI.loadWithUSB();
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

</style>
