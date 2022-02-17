<template>
  <b-jumbotron
    fluid
    :style="{ backgroundImage: headerImageURL }"
    class="mb-0"
  >
    <template #default>
      <h1>
        <b-img
          :src="logoImage"
          :width="logoWidth"
          :alt="altText"
        />
      </h1>
    </template>
  </b-jumbotron>
</template>

<script>
import logoImage from '../assets/logo.png';
import headerMixin from '@/components/mixins/headerMixin';

export default {
  name: 'ChannelHeader',
  mixins: [headerMixin],
  props: {
    section: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      logoImage,
      logoWidth: 160,
    };
  },
  computed: {
    altText() {
      return this.section ? this.section.title : 'PBS Kids';
    },
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
