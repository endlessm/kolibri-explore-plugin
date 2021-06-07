<template>
  <b-container class="mb-4">
    <b-card-group :deck="true">
      <b-card
        v-for="item in items"
        :key="item"
        borderVariant="light"
      >
        <div class="ph-item">
          <div class="card-img ph-picture"></div>
          <div class="ph-col-12">
            <div class="ph-row">
              <div class="big ph-col-12"></div>
              <div class="ph-col-12"></div>
              <div class="ph-col-12"></div>
              <div class="empty ph-col-12"></div>
              <div class="big ph-col-4"></div>
            </div>
          </div>
        </div>
      </b-card>
    </b-card-group>
  </b-container>
</template>

<script>
  export default {
    name: 'CardGridPlaceholder',
    props: {
      elements: {
        type: Number,
        default: 4,
      }
    },
    data() {
      return {
        items: Array(this.elements).keys(),
      };
    },
  }
</script>

<style lang="scss" scoped>
  @import '../styles.scss';
  @import 'placeholder-loading/src/scss/placeholder-loading.scss';

  .ph-item {
    min-height: card-body-height(3);
  }

  .card-body, .ph-item {
    padding: 0;
  }

  $card-image-ar: 9 / 16;
  .card-img {
    padding-top: percentage($card-image-ar);
    height: 0;
  }
</style>
