<template>
  <WelcomeBase title="Oops, you have selected another folder" titleVariant="text-dark">
    <template #body>
      <h5 class="font-weight-normal mb-5 text-muted">
        You can try again!
        Please make sure to select the "KOLIBRI_DATA" folder in your external device.
      </h5>
      <b-button
        variant="primary"
        @click="loadWithUSB"
      >
        Allow Access
      </b-button>
      <p class="mt-5">
        View your
        <b-link to="select-source">
          download choices
        </b-link>
        instead.
      </p>
    </template>
  </WelcomeBase>
</template>


<script>
  import WelcomeBase from './WelcomeBase.vue';

  export default {
    name: 'PermissionsWrongFolder',
    components: {
      WelcomeBase,
    },
    methods: {
      loadWithUSB() {
        this.$router.replace('/loading/default');
        window.EndlessAPI.loadWithUSB();
      },
    },
  };
</script>
