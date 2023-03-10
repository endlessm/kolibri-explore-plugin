<template>
  <WelcomeBase title="Endless Key needs access to your device">
    <template #body>
      <h5 class="font-weight-normal mb-4 text-muted">
        This will let you see and experience the content
        from the external device on your Endless Key app.
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
        pill
        class="mt-5"
        variant="primary"
        @click="onClick"
      >
        Allow
      </b-button>
    </template>
  </WelcomeBase>
</template>


<script>
  import FolderIcon from 'vue-material-design-icons/FolderOutline.vue';
  import WelcomeBase from './WelcomeBase.vue';

  export default {
    name: 'PermissionsExplanation',
    components: {
      FolderIcon,
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
