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
          <b-card
            :class="{ active: selection === 'download', disabled: isOffline }"
            title="Download Sample"
            subTitle="Choose a sample collection to download"
            titleTag="h5"
            subTitleTag="h6"
            :borderVariant="selection === 'download' ? 'primary' : 'default'"
            imgBottom
            :imgSrc="downloadSelectionImage"
          >
            <b-link
              href="#"
              class="stretched-link"
              :disabled="isOffline"
              @click="setSelection('download')"
            />
            <span
              v-if="selection === 'download'"
              class="icon-wrapper text-primary"
            >
              <CheckCircleIcon />
            </span>
          </b-card>
          <b-card
            :class="{ active: selection === 'usb' }"
            title="USB Drive Collection"
            subTitle="Explore collection stored on your USB Drive"
            titleTag="h5"
            subTitleTag="h6"
            :borderVariant="selection === 'usb' ? 'primary' : 'default'"
            imgBottom
            :imgSrc="usbSelectionImage"
          >
            <b-link
              href="#"
              class="stretched-link"
              @click="setSelection('usb')"
            />
            <span
              v-if="selection === 'usb'"
              class="icon-wrapper text-primary"
            >
              <CheckCircleIcon />
            </span>
          </b-card>
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

  import CheckCircleIcon from 'vue-material-design-icons/CheckCircle.vue';
  import DownloadSelectionImage from '../assets/download-selection.png';
  import UsbSelectionImage from '../assets/usb-selection.png';

  export default {
    name: 'ContentSourceSelection',
    components: { CheckCircleIcon },
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
  .card {
    border: $border-width solid $dark;
    border-radius: $border-radius-lg;
    background-color: $gray-200;
    .card-title {
      color: $dark;
    }
    &.active .card-title {
      color: $primary;
    }
    .icon-wrapper {
      position: absolute;
      right: map-get($spacers, 1);
      top: map-get($spacers, 1);
    }
    &.disabled {
      opacity: $disabled-card-opacity;
    }
  }


</style>
