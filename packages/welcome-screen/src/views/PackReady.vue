<template>
  <WelcomeBase title="Awesome! Your Starter Pack is ready">
    <template #body>
      <div class="pack-background"></div>
      <b-button
        pill
        class="mb-4 mt-4"
        :disabled="isOffline"
        variant="primary"
        @click="downloadContent"
      >
        Download My Starter Pack
      </b-button>
      <p>
        <b-link to="select-pack">
          Not sure? Let's go back to all the options.
        </b-link>
      </p>
    </template>
  </WelcomeBase>
</template>


<script>
  import { mapState } from 'vuex';
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
    computed: {
      ...mapState(['packSelected']),
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
        window.WelcomeWrapper.startWithNetwork(this.packSelected);
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
