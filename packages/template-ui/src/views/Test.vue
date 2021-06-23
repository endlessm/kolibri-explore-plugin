<template>
  <b-container>
    <h1>Endless</h1>
    <h2>Endless</h2>
    <h3>Endless</h3>
    <h4>Endless</h4>
    <h5>Endless</h5>
    <b-button pill>
      Endless
    </b-button>
    <b-button pill variant="outline-dark">
      Endless
    </b-button>
    <b-button pill variant="secondary">
      Endless
    </b-button>
    <b-button pill variant="primary">
      Endless
    </b-button>
    <p>
      <b-button variant="audio">
        Audio
      </b-button>
      <b-button variant="document">
        Document
      </b-button>
      <b-button variant="exercise">
        Exercise
      </b-button>
      <b-button variant="html5">
        HTML5
      </b-button>
      <b-button variant="video">
        Video
      </b-button>
    </p>
    <p>
      {{ sampleText }}
    </p>
    <p class="buttons-test">
      <b-button pill class="light-20 mb-1">
        lighten 20%
      </b-button>
      <b-button pill class="light-10 mb-1">
        lighten 10%
      </b-button>
      <b-button pill class="light-75 mb-1">
        lighten 7.5%
      </b-button>
      <b-button pill class="light-5 mb-1">
        lighten 5%
      </b-button>
      <b-button pill class="mb-1" variant="primary">
        primary
      </b-button>
      <b-button pill class="dark-5 mb-1">
        darken 5%
      </b-button>
      <b-button pill class="dark-75 mb-1">
        darken 7.5%
      </b-button>
      <b-button pill class="dark-10 mb-1">
        darken 10%
      </b-button>
      <b-button pill class="dark-20 mb-1">
        darken 20%
      </b-button>
    </p>
  </b-container>
</template>

<script>
export default {
  name: 'Test',
  data() {
    return {
      sampleText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.buttons-test {
  display: flex;
  flex-direction: column;
}

.light-20 {
  $value: scale-color($primary, $lightness: 20%);
  background-color: $value !important;
  border-color: $value !important;
  color: color-yiq($value);
}
.light-10 {
  $value: scale-color($primary, $lightness: 10%);
  background-color: $value !important;
  border-color: $value !important;
  color: color-yiq($value);
}
.light-75 {
  $value: scale-color($primary, $lightness: 7.5%);
  background-color: $value !important;
  border-color: $value !important;
  color: color-yiq($value);
}
.light-5 {
  $value: scale-color($primary, $lightness: 5%);
  background-color: $value !important;
  border-color: $value !important;
  color: color-yiq($value);
}
.dark-20 {
  $value: scale-color($primary, $lightness: -20%);
  background-color: $value !important;
  border-color: $value !important;
  color: color-yiq($value);
}
.dark-10 {
  $value: scale-color($primary, $lightness: -10%);
  background-color: $value !important;
  border-color: $value !important;
  color: color-yiq($value);
}
.dark-75 {
  $value: scale-color($primary, $lightness: -7.5%);
  background-color: $value !important;
  border-color: $value !important;
  color: color-yiq($value);
}
.dark-5 {
  $value: scale-color($primary, $lightness: -5%);
  background-color: $value !important;
  border-color: $value !important;
  color: color-yiq($value);
}

</style>
