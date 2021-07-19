<template>
  <b-container v-bind="$props" class="eos-container">
    <slot></slot>
  </b-container>
</template>

<style lang="scss" scoped>

  @import '../styles.scss';

  .eos-container {
    padding-left: $eos-container-padding;
    padding-right: $eos-container-padding;
  }

</style>
