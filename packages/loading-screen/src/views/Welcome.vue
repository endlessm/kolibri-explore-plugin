<template>

  <div>
    <div class="d-lg-block d-none right-bg"></div>
    <div class="d-lg-block d-none left-bg"></div>
    <div class="content p-3 pb-5 position-relative">
      <h1 class="text-primary">
        Welcome to the Endless Key!
      </h1>
      <h2 class="text-muted">
        Lorem ipsum
      </h2>
      <div class="buttons pt-5">
        <template v-if="showDownload">
          <b-button
            block
            variant="outline-primary"
            @click="downloadContent"
          >
            Download Content
          </b-button>
          <b-button
            block
            variant="primary"
            @click="useEndlessKeyUSB"
          >
            I Have an Endless Key USB Drive
          </b-button>
        </template>
        <template v-else>
          <b-button
            block
            variant="primary"
            @click="showDownload = true"
          >
            Get Started
          </b-button>
        </template>
      </div>
    </div>
  </div>

</template>


<script>

  export default {
    name: 'Welcome',
    data() {
      return {
        showDownload: false,
      };
    },
    methods: {
      downloadContent() {
        // TODO: comunicate with the webview to notify the selection
        this.$router.replace('/loading/default');
      },
      useEndlessKeyUSB() {
        // TODO: comunicate with the webview to notify the selection
        this.$router.replace('/loading/default');
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .left-bg,
  .right-bg {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .left-bg {
    background-image: url('../assets/welcome-bg-bottom-left.png');
    background-repeat: no-repeat;
    background-position: bottom left;
  }

  .right-bg {
    background-image: url('../assets/welcome-bg-top-right.png');
    background-repeat: no-repeat;
    background-position: top right;
  }

  h2 {
    font-size: medium;
  }

  .buttons {
    max-width: 300px;
    margin: 0 auto;
  }

</style>
