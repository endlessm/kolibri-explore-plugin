<template>
  <div>
    <div class="p-3 pb-5">
      <h1 class="text-primary">
        Select a content source
      </h1>
      <h5 class="font-weight-normal text-muted">
        View content from an Endless Key USB Drive Collection, or download one
        of our sample collections to start exploring.
      </h5>
      <div class="pt-5">
        <b-button
          class="m-1"
          :disabled="isOffline"
          variant="outline-primary"
          @click="downloadContent"
        >
          Download Content
        </b-button>
        <b-button
          class="m-1"
          variant="primary"
          @click="useEndlessKeyUSB"
        >
          I Have an Endless Key USB Drive
        </b-button>
      </div>
    </div>
  </div>
</template>


<script>

  export default {
    name: 'ContentSourceSelection',
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

</style>
