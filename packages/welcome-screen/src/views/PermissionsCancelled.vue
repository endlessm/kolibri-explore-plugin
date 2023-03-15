<template>
  <WelcomeBase title="Folder selection cancelled" titleVariant="text-dark">
    <template #header-top>
      <p class="mb-3 text-dark">
        <FolderAlertIcon size="64" />
      </p>
    </template>
    <template #body>
      <h5 class="font-weight-normal mb-5 text-muted">
        If that's not what you want, you can try again.
        Please make sure to select the "KOLIBRI_DATA" folder in your external device.
      </h5>
      <b-button
        pill
        variant="primary"
        @click="onClick"
      >
        Allow Access
      </b-button>
      <p class="mt-4">
        View your
        <b-link to="select-pack">
          download choices
        </b-link>
        instead.
      </p>
    </template>
  </WelcomeBase>
</template>


<script>
  import FolderAlertIcon from 'vue-material-design-icons/FolderAlertOutline.vue';
  import WelcomeBase from './WelcomeBase.vue';

  export default {
    name: 'PermissionsCancelled',
    components: {
      FolderAlertIcon,
      WelcomeBase,
    },
    methods: {
      onClick() {
        this.$router.push('/loading/default');
        window.WelcomeWrapper.startWithUSB();
      },
    },
  };
</script>
