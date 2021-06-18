<template>
  <b-jumbotron
    fluid
    :style="{ backgroundImage: headerImageURL }"
    class="mb-0"
  >
    <template v-slot:default>
      <div class="align-items-start d-flex justify-content-between mt-3">
        <h1>{{ section.title }}</h1>
        <ChannelLogo :channel="channel" size="lg" />
      </div>
      <b-row>
        <b-col md="6" sm="12">
          <div class="lead mb-2 text-muted">
            {{ headerDescription }}
          </div>
        </b-col>
      </b-row>
    </template>
  </b-jumbotron>
</template>

<script>
import { mapGetters } from 'vuex';

import headerMixin from '@/components/mixins/headerMixin';

export default {
  name: 'ChannelHeader',
  mixins: [headerMixin],
  computed: {
    ...mapGetters(['headerDescription']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

$header-color: rgba($secondary, 0.5);

.jumbotron {
  background-color: $header-color;
  background-size: cover;
  padding-top: $navbar-height;
}

img {
  box-shadow: $toast-box-shadow;
}

</style>
