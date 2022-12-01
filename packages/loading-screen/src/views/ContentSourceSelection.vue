<template>
  <WelcomeBase title="Select a content source">
    <template #body>
      <h5 class="font-weight-normal mb-5 text-muted">
        Download one of our sample collections or view content from an
        Endless Key external drive.
      </h5>
      <b-card-group deck>
        <WelcomeCard
          class="mb-3"
          title="Download Sample"
          subTitle="Choose a sample collection to download"
          :selected="selection === 'download'"
          :img="downloadSelectionImage"
          :disabled="isOffline"
          @click="setSelection('download')"
        />
        <WelcomeCard
          class="mb-3"
          title="USB Drive Collection"
          subTitle="Explore collection stored on your USB Drive"
          :selected="selection === 'usb'"
          :img="usbSelectionImage"
          @click="setSelection('usb')"
        />
      </b-card-group>
      <b-button
        class="mt-5"
        :disabled="selection === null"
        variant="primary"
        @click="onNext"
      >
        Next
      </b-button>
    </template>
  </WelcomeBase>
</template>


<script>
  import DownloadSelectionImage from '../assets/download-selection.png';
  import UsbSelectionImage from '../assets/usb-selection.png';
  import WelcomeBase from './WelcomeBase.vue';

  export default {
    name: 'ContentSourceSelection',
    components: {
      WelcomeBase,
    },
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
        this.$router.push('/loading/default');
        window.EndlessAPI.load();
      },
      useEndlessKeyUSB() {
        this.$router.push('/endless-key');
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
