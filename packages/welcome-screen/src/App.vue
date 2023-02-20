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
  created () {
    document.title = "Welcome";
  },
  mounted() {
    window.WelcomeApp = {
      showLoadingRetry: () => {
        this.navigateTo('/loading/retry');
      },
      showLoadingError: () => {
        this.navigateTo('/loading/error');
      },
      showWelcome: () => {
        this.navigateTo('/welcome');
      },
      showConnectKey: () => {
        this.navigateTo('/endless-key');
      },
      showConnectKeyRequired: () => {
        this.navigateTo('/endless-key-required');
      },
      showPermissionsCancelled: () => {
        this.navigateTo('/permissions-cancelled');
      },
      showPermissionsWrongFolder: () => {
        this.navigateTo('/permissions-wrong-folder');
      },
      setHasUSB: (isUsbConnected) => {
        this.$store.commit('setUsbConnected', isUsbConnected);
      },
      setNeedsPermission: (needsPermission) => {
        this.$store.commit('setNeedsPermission', needsPermission);
      },
    };
  },
  methods: {
    navigateTo(path) {
      if (this.$route.path != path) {
          this.$router.push(path);
        }
    },
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
