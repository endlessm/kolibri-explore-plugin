<template>
  <WelcomeBase title="Awesome! We are preparing your Starter Pack">
    <template #body>
      <div class="pack-background"></div>
      <b-button
        class="mb-4 mt-4"
        :disabled="isOffline"
        variant="primary"
        @click="downloadContent"
      >
        Download Pack
      </b-button>
      <p class="mb-5">
        If you have an Endless Key USB device or SD card,
        <b-link @click="useEndlessKeyUSB">
          click here
        </b-link>
        to get your pack!
      </p>
    </template>
  </WelcomeBase>
</template>


<script>
  import WelcomeBase from './WelcomeBase.vue';

  export default {
    name: 'PackReady',
    components: {
      WelcomeBase,
    },
    data() {
      return {
        isOffline: false,
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
@import '../styles.scss';
.pack-background {
  background-image: url('../assets/pack.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  height: 170px;
  @include media-breakpoint-down(sm) {
    height: 120px;
  }
}
</style>
