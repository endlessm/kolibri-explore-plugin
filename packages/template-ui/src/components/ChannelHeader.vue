<template>
  <b-jumbotron
    fluid
    :style="{ backgroundImage: headerImageURL }"
    class="mb-0"
  >
    <template v-slot:default>
      <div class="align-items-start d-flex justify-content-between mt-3">
        <h1>{{ section.title }}</h1>
        <b-img
          v-if="displayLogoInHeader && channel.thumbnail"
          class="rounded-lg"
          :width="headerLogoWidth"
          :src="channel.thumbnail"
        />
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

// FIXME this will be the secondary color instead of a custom color derived from the success color.
// Waiting for the change in Figma.
$header-color: rgba($success, 0.5);

.jumbotron {
  background-color: $header-color;
  background-size: cover;
  background-position-y: -$navbar-height;
}

img {
  box-shadow: $toast-box-shadow;
}

</style>
