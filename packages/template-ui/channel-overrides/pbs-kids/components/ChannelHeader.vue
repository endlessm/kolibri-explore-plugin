<template>
  <b-jumbotron
    fluid
    :style="{ backgroundImage: headerImageURL }"
    class="mb-0"
  >
    <template v-slot:default>
      <h1>
        <b-img
          :src="logoImage"
          :width="logoWidth"
          :alt="section.title"
        />
      </h1>
    </template>
  </b-jumbotron>
</template>

<script>
import headerMixin from '@/components/mixins/headerMixin';
import logoImage from '../assets/logo.png';

export default {
  name: 'ChannelHeader',
  mixins: [headerMixin],
  data() {
    return {
      logoImage,
      logoWidth: 160,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

// The gap needed for a header height of 240px and a logo height of 160px
$logo-top: 40px; // (240 - 160) / 2

.jumbotron {
  background-position: top center;
  background-repeat: no-repeat;
  background-size: auto $header-height;
  margin-top: $navbar-height;
  height: $header-height;
  padding-top: 40px;
}

</style>
