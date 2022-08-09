<template>
  <div>
    <div class="p-3 pb-5">
      <h1 class="text-primary">
        The Endless Key needs access to your device
      </h1>

      <b-container class="inner-container">
        <h5 class="font-weight-normal text-muted">
          This will let you see and experience the content
          from your external device on your Endless Key app.
        </h5>

        <b-list-group>
          <b-list-group-item variant="dark">
            <b>1. Open the Endless Key external device</b>
          </b-list-group-item>
          <b-list-group-item variant="dark">
            <b>2. Select the "KOLIBRI_DATA" folder</b>
            <br>
            <span class="text-muted"><FolderIcon /> KOLIBRI_DATA</span>
          </b-list-group-item>
          <b-list-group-item variant="dark">
            <b>3. Allow access</b>
          </b-list-group-item>
        </b-list-group>

        <b-button
          class="mt-5"
          variant="primary"
          @click="openSystemPermission"
        >
          Allow
        </b-button>
      </b-container>
    </div>
  </div>
</template>


<script>
  import FolderIcon from 'vue-material-design-icons/FolderOutline.vue';

  export default {
    name: 'PermissionsExplanation',
    components: {
      FolderIcon,
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
