<template>
  <div>
    <div class="p-3 pb-5">
      <h1 class="text-primary">
        Connect your Endless Key USB Drive
      </h1>

      <b-container class="inner-container">
        <h5 class="font-weight-normal text-muted">
          If you have an Endless Key Content USB Drive, you can connect it
          to your computer, to explore its contents.
        </h5>

        <img class="mt-4 w-100" :src="usbBackground">

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
          <b-link @click="goBack">
            download choices
          </b-link>
          instead.
        </p>
      </b-container>
    </div>
  </div>
</template>


<script>
  import usbBackgroundConnect from '../assets/usb-connect.jpg';
  import usbBackgroundConnected from '../assets/usb-connected.jpg';

  export default {
    name: 'UsbDriveConnection',
    props: {
      required: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        hasUSB: false,
        needsPermission: false,
      };
    },
    computed: {
      usbBackground() {
        if (this.hasUSB) {
          return usbBackgroundConnected;
        }
        return usbBackgroundConnect;
      },
    },
    mounted() {
      window.setHasUSB = (hasUSB) => {
        this.hasUSB = hasUSB;
      };
      window.setNeedsPermission = (needsPermission) => {
        this.needsPermission = needsPermission;
      };
    },
    beforeDestroy() {
      function fallback() {
        console.log('No loading screen');
      };
      window.setHasUSB = fallback;
      window.needsPermission = fallback;
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
      goBack() {
        this.$router.replace('/welcome');
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
