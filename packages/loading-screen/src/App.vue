<template>
  <div
    id="app"
    class="align-items-center d-flex flex-column justify-content-center min-vh-100 text-center"
  >
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      firstLaunch: false,
    };
  },
  mounted() {
    window.show_retry = () => {
      this.$router.replace('/loading/retry');
    }

    window.show_error = () => {
      this.$router.replace('/loading/error');
    }

    window.show_loading = () => {
      this.$router.replace('/loading/default');
    }

    window.clean = () => {
      this.$router.replace('/loading/default');
    }

    window.show_welcome = () => {
      this.$router.replace('/welcome');
    }

    window.show_endless_key = () => {
      this.$router.push('/endless-key-required');
    }

    window.setHasUSB = () => {
      // Does nothing.
      // This function is implemented in the UsbDriveConnection view component
    }

    window.firstLaunch = () => {
      this.firstLaunch = true;
      this.$router.replace('/welcome');
    }
  },
  beforeDestroy() {
    function fallback() {
      console.log('No loading screen');
    };
    window.show_retry = fallback;
    window.show_error = fallback;
    window.show_loading = fallback;
    window.clean = fallback;
    window.firstLaunch = fallback;
    window.show_welcome = fallback;
    window.show_endless_key = fallback;
  },
};
</script>

<style lang="scss">
@import '@/index.scss';

html {
  height: 100%;
}
body {
  min-height: 100vh;
  background-color: white;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: white;
}

</style>
