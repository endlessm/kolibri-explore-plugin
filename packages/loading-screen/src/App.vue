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
    document.title = this.$formatMessage({
      id: 'welcomeDocumentTitle',
      defaultMessage: 'Welcome',
      description: 'Document title for the welcome page',
    });
  },
  mounted() {
    window.LoadingApp = {
      showLoadingRetry: () => {
        this.navigateTo('/loading/retry');
      },
      showLoadingError: () => {
        this.navigateTo('/loading/error');
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
