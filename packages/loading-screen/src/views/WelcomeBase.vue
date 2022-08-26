<template>
  <b-container class="no-container-padding welcome-container">
    <slot name="header">
      <h1 class="mb-3 text-primary">
        {{ title }}
      </h1>
    </slot>
    <b-row class="justify-content-center">
      <b-col cols="12" sm="8">
        <slot name="body">
        </slot>
      </b-col>
    </b-row>
    <slot name="extra-body">
      <!-- Use this slot for advanced grid. Eg: multiple columns. -->
    </slot>
  </b-container>
</template>


<script>
  export default {
    name: 'WelcomeBase',
    props: {
      title: {
        type: String,
        required: true,
      },
    },
  };
</script>


<style lang="scss" scoped>
  @import '../styles';

  .welcome-container {
    padding-top: $spacer;
    padding-bottom: $spacer;

    @include media-breakpoint-down(xs) {
      padding-left: $spacer;
      padding-right: $spacer;
    }
  }
</style>
