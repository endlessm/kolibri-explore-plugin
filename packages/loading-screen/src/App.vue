<template>
  <div
    id="app"
    class="align-items-center d-flex flex-column justify-content-center text-center vh-100"
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
    window.clean = fallback;
    window.firstLaunch = fallback;
    window.welcome = fallback;
  },
};
</script>

<style lang="scss">
@import '@/index.scss';

html {
  height: 100%;
}
/* Always show the vertical scrollbar */
body {
  overflow: hidden;
  min-height: 100vh;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background-color: white;
}

</style>
