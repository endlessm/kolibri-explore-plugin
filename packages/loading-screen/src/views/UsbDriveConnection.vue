<template>
  <WelcomeBase title="Connect your Endless Key external drive">
    <template #body>
      <img
        class="w-100"
        :src="usbBackground"
        alt="If you have an Endless Key external drive you can connect it
             to your computer to explore its contents."
      >
      <b-button
        class="mt-5"
        variant="primary"
        :disabled="!hasUSB"
        @click="loadWithUSB"
      >
        Next
      </b-button>
      <p v-if="!required" class="mt-5">
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
