<template>
  <div class="d-flex flex-column flex-grow-1 w-100">
    <div class="flex-grow-1 welcome-background-top"></div>
    <div class="content p-3 pb-5 position-relative">
      <h1 class="text-primary">
        Welcome to Endless Key!
      </h1>
      <h5 class="font-weight-normal text-muted">
        Let's begin by helping you find your content.
      </h5>
      <div class="pt-5">
        <b-button
          variant="primary"
          @click="goToContentSourceSelection"
        >
          Get Started
        </b-button>
      </div>
    </div>
    <div class="flex-grow-1 welcome-background-bottom"></div>
  </div>
</template>


<script>

  export default {
    name: 'Welcome',
    methods: {
      goToContentSourceSelection() {
        this.$router.replace('/select-source');
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .welcome-background-bottom,
  .welcome-background-top {
    background-size: contain;
    background-repeat: no-repeat;
  }

  .welcome-background-top {
    background-image: url('../assets/welcome-bg-top-right.jpg');
    background-position: top right;
  }

  .welcome-background-bottom {
    background-image: url('../assets/welcome-bg-bottom-left.jpg');
    background-position: bottom left;
  }

</style>
