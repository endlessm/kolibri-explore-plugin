<template>
  <div class="d-flex flex-column flex-grow-1 w-100">
    <div class="flex-grow-1 welcome-background-top"></div>
    <div class="content p-3 pb-5 position-relative">
      <h1 class="text-primary">
        Welcome to the Endless Key!
      </h1>
      <h5 class="font-weight-normal text-muted">
        Let's begin by helping you find your content
      </h5>
      <div class="pt-5">
        <template v-if="showDownload">
          <b-button
            class="mx-1"
            :disabled="isOffline"
            variant="outline-primary"
            @click="downloadContent"
          >
            Download Content
          </b-button>
          <b-button
            class="mx-1"
            variant="primary"
            @click="useEndlessKeyUSB"
          >
            I Have an Endless Key USB Drive
          </b-button>
        </template>
        <template v-else>
          <b-button
            variant="primary"
            @click="showDownload = true"
          >
            Get Started
          </b-button>
        </template>
      </div>
    </div>
    <div class="flex-grow-1 welcome-background-bottom"></div>
  </div>

</template>


<script>

  export default {
    name: 'Welcome',
    data() {
      return {
        isOffline: false,
        showDownload: false,
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

  .welcome-background-bottom,
  .welcome-background-top {
    background-size: contain;
    background-repeat: no-repeat;
  }

  .welcome-background-top {
    background-image: url('../assets/welcome-bg-top-right.jpg');
    background-position: top right;
  }

  .welcome-background-bottom {
    background-image: url('../assets/welcome-bg-bottom-left.jpg');
    background-position: bottom left;
  }

</style>
