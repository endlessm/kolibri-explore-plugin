<template>
  <div>
    <div class="p-3 pb-5">
      <h1 class="text-primary">
        Select a content source
      </h1>
      <b-container class="inner-container">
        <h5 class="font-weight-normal text-muted">
          View content from an Endless Key USB Drive Collection, or download one
          of our sample collections to start exploring.
        </h5>
        <b-card-group deck class="pt-5">
          <WelcomeCard
            title="Download Sample"
            subTitle="Choose a sample collection to download"
            :selected="selection === 'download'"
            :img="downloadSelectionImage"
            :disabled="isOffline"
            @click="setSelection('download')"
          />
          <WelcomeCard
            title="USB Drive Collection"
            subTitle="Explore collection stored on your USB Drive"
            :selected="selection === 'usb'"
            :img="usbSelectionImage"
            @click="setSelection('usb')"
          />
        </b-card-group>
        <div class="pt-5">
          <b-button
            class="m-1"
            :disabled="selection === null"
            variant="primary"
            @click="onNext"
          >
            Next
          </b-button>
        </div>
      </b-container>
    </div>
  </div>
</template>


<script>

  import DownloadSelectionImage from '../assets/download-selection.png';
  import UsbSelectionImage from '../assets/usb-selection.png';

  export default {
    name: 'ContentSourceSelection',
    data() {
      return {
        selection: null,  // 'download', 'usb'
        isOffline: false,
        usbSelectionImage: UsbSelectionImage,
        downloadSelectionImage: DownloadSelectionImage,
      };
    },
    created() {
      this.isOffline = !navigator.onLine;
      window.addEventListener('offline', this.onOffline);
      window.addEventListener('online', this.onOnline);
    },
    destroyed() {
      window.removeEventListener('offline', this.onOffline);
      window.removeEventListener('online', this.onOnline);
    },
    methods: {
      downloadContent() {
        this.$router.replace('/loading/default');
        window.EndlessAPI.load();
      },
      useEndlessKeyUSB() {
        this.$router.replace('/endless-key');
      },
      setSelection(selection) {
        this.selection = selection;
      },
      onNext() {
        switch (this.selection) {
          case 'download':
            return this.downloadContent();
          case 'usb':
            return this.useEndlessKeyUSB();
        }
      },
      onOffline() {
          this.isOffline = true;
      },
      onOnline() {
          this.isOffline = false;
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  // We need a custom container:
  .inner-container {
    @include media-breakpoint-up(md) {
      max-width: $inner-container-max-width;
    }
  }

</style>
