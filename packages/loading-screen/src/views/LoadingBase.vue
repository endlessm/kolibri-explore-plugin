<template>
  <b-container
    class="d-flex flex-column flex-grow-1 loading-container no-container-padding"
  >
    <b-container
      class="d-flex flex-column flex-grow-1 justify-content-center no-container-padding"
    >
      <slot name="header">
        <slot name="header-top"></slot>
        <h1 v-if="title" class="mb-3" :class="titleVariant">
          {{ title }}
        </h1>
      </slot>
      <b-row v-if="hasBody" class="justify-content-center">
        <b-col cols="12" sm="8">
          <slot name="body">
          </slot>
        </b-col>
      </b-row>
      <slot name="extra-body">
        <!-- Use this slot for advanced grid. Eg: multiple columns. -->
      </slot>
    </b-container>
    <b-container v-if="hasFooter" id="footer" class="no-container-padding">
      <slot name="footer"></slot>
    </b-container>
  </b-container>
</template>


<script>
  export default {
    name: 'LoadingBase',
    props: {
      title: {
        type: String,
        default: null,
      },
      titleVariant: {
        type: String,
        default: null,
      }
    },
    computed: {
      hasBody() {
        return !!this.$slots.body;
      },
      hasFooter() {
        return !!this.$slots.footer;
      },
    },
  };
</script>


<style lang="scss" scoped>
  @import '../styles';

  .loading-container {
    padding-top: $spacer;
    padding-bottom: $spacer;

    @include media-breakpoint-down(xs) {
      padding-left: $spacer;
      padding-right: $spacer;
    }
  }
</style>
