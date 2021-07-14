<template>
  <b-jumbotron
    fluid
    :style="{ backgroundImage: headerImageURL }"
    class="mb-0"
  >
    <template v-slot:default>
      <div class="align-items-start d-flex justify-content-between mt-3">
      </div>
      <b-row>
        <b-col xs="12" sm="8" md="9" lg="9" xl="8">
          <h1
            class="d-md-none h3"
            :class="{ 'text-light': hasDarkHeader }"
          >
            {{ section.title }}
          </h1>
          <h1
            class="d-md-block d-none"
            :class="{ 'text-light': hasDarkHeader }"
          >
            {{ section.title }}
          </h1>
          <div
            class="lead mb-2"
            :class="{ 'text-light': hasDarkHeader, 'text-muted': !hasDarkHeader }"
          >
            {{ headerDescription }}
          </div>
        </b-col>
        <b-col v-if="displayLogoInHeader" class="d-none d-sm-flex justify-content-end">
          <ChannelLogo class="d-lg-none d-none d-sm-block" :channel="channel" size="lg" />
          <ChannelLogo class="d-lg-block d-none" :channel="channel" size="xl" />
        </b-col>
      </b-row>
    </template>
  </b-jumbotron>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

import headerMixin from '@/components/mixins/headerMixin';

export default {
  name: 'ChannelHeader',
  mixins: [headerMixin],
  computed: {
    ...mapState(['displayLogoInHeader', 'hasDarkHeader']),
    ...mapGetters(['headerDescription']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.jumbotron {
  @include navbar-background($header-height);
  padding-top: $navbar-height;
  height: $header-height;
  padding-bottom: $navbar-height;
}

img {
  box-shadow: $toast-box-shadow;
}

</style>
