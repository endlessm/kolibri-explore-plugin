<template>
  <b-container class="bg-white mt-3 p-0 wrapper" fluid>
    <b-container class="main-container position-relative">
      <BackButton />
      <b-row>
        <b-col>
          <h1>{{ title }}</h1>
        </b-col>
      </b-row>
      <b-row>
        <b-col xl="6" lg="6" md="8" sm="12" xs="12">
          <p>{{ subtitle }}</p>
          <slot>
          </slot>
        </b-col>
      </b-row>
    </b-container>
  </b-container>
</template>

<script>

export default {
  name: 'DetailView',
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
