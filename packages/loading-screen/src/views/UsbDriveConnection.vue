<template>
  <WelcomeBase title="Connect your Endless Key USB Drive">
    <template #body>
      <h5 class="font-weight-normal mb-5 text-muted">
        If you have an Endless Key Content USB Drive, you can connect it
        to your computer, to explore its contents.
      </h5>
      <img class="w-100" :src="usbBackground">
      <b-button
        class="mt-5"
        variant="primary"
        :disabled="!hasUSB"
        @click="loadWithUSB"
      >
        Next
      </b-button>
      <p v-if="!required" class="mt-5">
        Check your
        <b-link to="select-source">
          download choices
        </b-link>
        instead.
      </p>
    </template>
  </WelcomeBase>
</template>


<script>
  import usbBackgroundConnect from '../assets/usb-connect.jpg';
  import usbBackgroundConnected from '../assets/usb-connected.jpg';
  import { store } from "../store.js";
  import WelcomeBase from './WelcomeBase.vue';

  export default {
    name: 'UsbDriveConnection',
    components: {
      WelcomeBase,
    },
    props: {
      required: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      hasUSB() {
        return store.state.isUsbConnected;
      },
      needsPermission() {
        return store.state.needsPermission;
      },
      usbBackground() {
        if (this.hasUSB) {
          return usbBackgroundConnected;
        }
        return usbBackgroundConnect;
      },
    },
    methods: {
      loadWithUSB() {
        if (this.needsPermission) {
          this.$router.replace('/grant-permissions');
        }
        else {
          this.$router.replace('/loading/default');
          window.EndlessAPI.loadWithUSB();
        }
      },
    },
  };

</script>
