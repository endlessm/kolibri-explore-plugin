<template>

  <b-container>
    <div class="content p-3 pb-5 position-relative">
      <h1 class="text-primary">
        Connect your Endless Key USB Drive
      </h1>
      <h2 class="text-muted">
        If you have an Endless Key Content USB Drive, you can connect it
        to your computer, to explore its contents.
      </h2>

      <div class="endless-key mt-5">
        <p>
          Once you connect your Drive, click the “Load my content” button below.
        </p>
      </div>

      <div class="buttons mt-5">
        <b-button
          class="mx-4"
          variant="link"
          @click="goBack"
        >
          Back
        </b-button>
        <b-button
          class="mx-4"
          variant="primary"
          :disabled="!hasUSB"
          @click="loadWithUSB"
        >
          Load my content
        </b-button>
      </div>
    </div>
  </b-container>

</template>


<script>

  export default {
    name: 'EndlessKey',
    data() {
      return {
        hasUSB: false,
      };
    },
    mounted() {
      window.setHasUSB = (hasUSB) => {
        this.hasUSB = hasUSB;
      };
    },
    beforeDestroy() {
      function fallback() {
        console.log('No loading screen');
      };
      window.setHasUSB = fallback;
    },
    methods: {
      loadWithUSB() {
        // TODO: comunicate with the webview to notify the selection
        this.$router.replace('/loading/default');
      },
      goBack() {
        this.$router.replace('/welcome');
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  h2 {
    font-size: medium;
  }

  .endless-key {
    background-image: url('../assets/endless-key.png');
    background-size: cover;
    background-position: center;
    border-radius: $border-radius-lg;
    min-height: 300px;
    position: relative;
  }

  .endless-key p {
    position: absolute;
    right: 10px;
    bottom: 10px;
    width: 50%;
    padding: 1em 1.5em;
    text-align: left;
    font-weight: bold;
  }

</style>
