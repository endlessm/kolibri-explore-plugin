<template>
  <b-button
    class="back-button rounded-circle"
    :disabled="isDisabled"
    :class="variant"
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
    props: {
      variant: {
        type: String,
        default: 'light',
      },
    },
    data() {
      return {
        isDisabled: true,
      };
    },
    mounted() {
      this.isDisabled = window.history.length === 1;
    },
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
  }

  .back-button.light {
    background-color: rgba($gray-700, 0.1);
    color: $gray-700;
    &.disabled {
      background-color: rgba($gray-500, 0.1);
      color: $gray-500;
    }
  }

  .back-button.light:hover:not(.disabled) {
    background-color: rgba($gray-700, 0.2);
  }

  .back-button.dark {
    background-color: rgba($white, 0.1);
    color: $white;
    &.disabled {
      background-color: rgba($white, 0.05);
      color: $gray-500;
    }
  }

  .back-button.dark:hover:not(.disabled) {
    background-color: rgba($white, 0.2);
  }

</style>
