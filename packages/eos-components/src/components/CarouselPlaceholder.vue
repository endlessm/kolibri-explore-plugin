<template>
  <b-container class="mb-4">
    <!-- carousel -->
    <div class="ph-item">
      <div class="ph-col-6">
        <div class="ph-picture"></div>
      </div>
      <div class="ph-col-6">
        <div class="ph-row">
          <div class="big ph-col-6"></div>
          <div class="big empty ph-col-6"></div>

          <div class="ph-col-12"></div>
          <div class="ph-col-8"></div>
          <div class="empty ph-col-4"></div>
          <div class="ph-col-12"></div>
          <div class="ph-col-6"></div>
          <div class="empty ph-col-6"></div>

          <div class="empty ph-col-12"></div>
          <div class="empty ph-col-12"></div>
          <div class="big ph-col-2"></div>
        </div>
      </div>
    </div>
  </b-container>
</template>

<script>
  export default {
    name: 'CarouselPlaceholder',
  }
</script>

<style lang="scss" scoped>
  @import '@/styles.scss';
  @import 'placeholder-loading/src/scss/placeholder-loading.scss';

  .ph-item {
    min-height: card-body-height(5);
  }
  .ph-picture {
    height: 100%;
  }
</style>
