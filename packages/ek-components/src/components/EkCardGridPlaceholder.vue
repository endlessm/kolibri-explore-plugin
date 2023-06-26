<template>
  <b-container class="mb-5 mt-3 no-container-padding section-container">
    <slot></slot>
    <b-container>
      <b-card-group :deck="true">
        <b-card
          v-for="item in items"
          :key="item"
          borderVariant="light"
          noBody
          imgTop
        >
          <b-skeleton-img cardImg="top" />
          <b-card-body class="d-flex flex-column">
            <b-skeleton width="85%" />
            <b-skeleton width="55%" />
            <b-skeleton width="35%" />

            <b-skeleton class="mt-5" type="button" />
          </b-card-body>
        </b-card>
      </b-card-group>
    </b-container>
  </b-container>
</template>

<script>
  export default {
    name: 'EkCardGridPlaceholder',
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
</style>
