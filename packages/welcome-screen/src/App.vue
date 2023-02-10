<template>
  <div
    id="app"
    class="d-flex min-vh-100 text-center"
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
      this.$router.push('/loading/retry');
    }

    window.show_error = () => {
      this.$router.push('/loading/error');
    }

    window.show_loading = () => {
      this.$router.push('/loading/default');
    }

    window.clean = () => {
      this.$router.push('/loading/default');
    }

    window.show_welcome = () => {
      this.$router.push('/welcome');
    }

    window.show_endless_key = () => {
      this.$router.push('/endless-key');
    }

    window.show_endless_key_required = () => {
      this.$router.push('/endless-key-required');
    }

    window.show_permissions_cancelled = () => {
      this.$router.push('/permissions-cancelled');
    }

    window.show_wrong_folder = () => {
      this.$router.push('/permissions-wrong-folder');
    }

    window.setHasUSB = (isUsbConnected) => {
      this.$store.commit('setUsbConnected', isUsbConnected);
    }

    window.setNeedsPermission = (needsPermission) => {
      this.$store.commit('setNeedsPermission', needsPermission);
    }

    window.firstLaunch = () => {
      this.firstLaunch = true;
      this.$router.push('/welcome');
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
    window.show_endless_key_required = fallback;
    window.show_permissions_cancelled = fallback;
    window.show_wrong_folder = fallback;
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
}

</style>
