<template>
  <b-container class="bg-white wrapper" fluid>
    <b-container class="main-container">
      <b-button
        href="#"
        pill
        variant="light"
        size="sm"
        class="my-3 pl-0"
        @click="$router.go(-1)"
      >
        <span><ArrowLeft />Back</span>
      </b-button>
      <h1>{{ title }}</h1>
      <p>{{ subtitle }}</p>
      <slot>
      </slot>
    </b-container>
  </b-container>
</template>

<script>
import ArrowLeft from 'vue-material-design-icons/ArrowLeft.vue';

export default {
  name: 'DetailView',
  components: {
    ArrowLeft,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

$main-container-top: $navbar-height;
$main-container-bottom: $spacer * 3.5;

.main-container {
  padding-top: $main-container-top;
  padding-bottom: $main-container-bottom;
}

</style>
