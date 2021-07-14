<template>
  <b-container class="bg-white wrapper" fluid>
    <b-container class="main-container">
      <slot>
      </slot>
    </b-container>
  </b-container>
</template>

<script>
export default {
  name: 'DetailView',
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

$main-container-top: $navbar-height + $spacer * 4;
$main-container-bottom: $spacer * 3.5;

.main-container {
  padding-top: $main-container-top;
  padding-bottom: $main-container-bottom;
}

</style>
