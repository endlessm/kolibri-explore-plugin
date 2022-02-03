<template>
  <b-button
    class="back-button rounded-circle"
    @click="$router.go(-1)"
  >
    <ArrowLeft />
  </b-button>
</template>

<script>
  import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue';

  export default {
    name: 'BackButton',
    components: { ArrowLeft },
  }
</script>

<style lang="scss" scoped>
  @import '../styles.scss';

  .back-button {
    position: absolute;
    padding: 0;
    border: none;
    margin-left: calc(0px - $circled-button-size - $spacer);

    width: $circled-button-size;
    height: $circled-button-size;

    background-color: rgba($gray-700, 0.1);
    color: $gray-700;
  }

  .back-button:hover {
    background-color: rgba($gray-700, 0.2);
  }

</style>
