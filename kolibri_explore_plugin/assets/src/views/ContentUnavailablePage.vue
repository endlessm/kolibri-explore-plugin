<template>

  <div
    class="d-flex main-container min-vh-100 text-center"
  >
    <b-container
      class="d-flex flex-column flex-grow-1 no-container-padding welcome-container"
    >
      <b-container
        class="d-flex flex-column flex-grow-1 justify-content-center no-container-padding"
      >
        <h1 class="mb-3">
          {{ $tr('titleLabel') }}
        </h1>
        <b-row class="justify-content-center mt-3">
          <b-col cols="12" sm="8">
            <b-button pill variant="primary" :to="homePageLink">
              {{ $tr('retryLink') }}
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </b-container>
  </div>

</template>


<script>

  import { PageNames } from '../constants';

  export default {
    name: 'ContentUnavailablePage',
    metaInfo() {
      return {
        title: this.$tr('documentTitle'),
      };
    },
    computed: {
      homePageLink() {
        return {
          name: PageNames.ROOT,
        };
      },
    },
    $trs: {
      titleLabel: 'Something went wrong!',
      retryLink: 'Try again',
      documentTitle: 'Resource Unavailable',
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .main-container {
    background-color: white;
  }

  .welcome-container {
    padding-top: $spacer;
    padding-bottom: $spacer;

    @include media-breakpoint-down(xs) {
      padding-right: $spacer;
      padding-left: $spacer;
    }
  }

</style>
