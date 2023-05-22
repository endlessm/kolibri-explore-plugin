<template>
  <b-container class="mb-4">
    <b-card noBody imgLeft>
      <b-skeleton-img cardImg="left" />
      <b-card-body class="d-flex flex-column">
        <b-skeleton width="85%" />
        <b-skeleton width="55%" />

        <div class="align-items-center d-flex justify-content-between mt-auto">
          <b-skeleton width="20%" />
          <b-skeleton type="button" />
        </div>
      </b-card-body>
    </b-card>
  </b-container>
</template>

<script>
  export default {
    name: 'EkCarouselPlaceholder',
  }
</script>

<style lang="scss" scoped>
  @import '../styles.scss';

  .card > .b-aspect {
    width: $carousel-image-width;
    @include media-breakpoint-up(lg) {
      width: $carousel-image-lg-width;
    }
  }

  .b-skeleton-text {
    height: $h4-font-size * $headings-line-height;
    @include media-breakpoint-up(lg) {
      height: $h3-font-size * $headings-line-height;
    }
  }
</style>
