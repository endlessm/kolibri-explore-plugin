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
        pill
        class="mb-4 mt-5"
        variant="primary"
        :disabled="!hasUSB"
        @click="onClick"
      >
        Next
      </b-button>
      <p v-if="!required">
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
  import usbBackgroundConnect from '../assets/usb-connect.jpg';
  import usbBackgroundConnected from '../assets/usb-connected.jpg';
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
        return this.$store.state.isUsbConnected;
      },
      needsPermission() {
        return this.$store.state.needsPermission;
      },
      usbBackground() {
        if (this.hasUSB) {
          return usbBackgroundConnected;
        }
        return usbBackgroundConnect;
      },
    },
    methods: {
      onClick() {
        if (this.needsPermission) {
          this.$router.push('/grant-permissions');
        }
        else {
          this.$router.push('/loading/default');
          window.WelcomeWrapper.startWithUSB();
        }
      },
    },
  };

</script>
