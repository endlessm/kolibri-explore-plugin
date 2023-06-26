<template>
  <b-jumbotron
    fluid
    :style="{ backgroundImage: headerImageURL }"
    class="mb-0"
  >
    <template #default>
      <div class="align-items-start d-flex justify-content-between mt-5">
      </div>
      <b-row>
        <b-col xs="12" sm="8" md="9" lg="9" xl="8">
          <BackButton :variant="hasDarkHeader ? 'dark' : 'light'" />
          <h1
            class="d-md-none h3"
            :class="{ 'text-light': hasDarkHeader }"
          >
            {{ headerTitle }}
          </h1>
          <h1
            class="d-md-block d-none"
            :class="{ 'text-light': hasDarkHeader }"
          >
            {{ headerTitle }}
          </h1>
          <div
            class="lead mb-2"
            :class="{ 'text-light': hasDarkHeader }"
          >
            <EkClamp
              :maxLines="maxDescriptionLines"
              :text="headerDescription"
            />
          </div>
        </b-col>
        <b-col v-if="displayLogoInHeader" class="d-none d-sm-flex justify-content-end">
          <EkChannelLogo class="d-lg-none d-none d-sm-block" :channel="channel" size="lg" />
          <EkChannelLogo class="d-lg-block d-none" :channel="channel" size="xl" />
        </b-col>
      </b-row>
    </template>
  </b-jumbotron>
</template>

<script>
import { mapState } from 'vuex';

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
      maxDescriptionLines: 6,
    };
  },
  computed: {
    ...mapState(['displayLogoInHeader', 'hasDarkHeader']),
    headerTitle() {
      if (!this.section || this.section.id === this.channel.id) {
        return this.channel.name;
      }
      return this.section.title;
    },
    headerDescription() {
      if (!this.section || this.section.id === this.channel.id) {
        return this.channel.description;
      }
      return this.section.description;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.jumbotron {
  background-color: $header-color;
  background-attachment: fixed;
  background-position: top center;
  background-repeat: no-repeat;
  background-size: 100% auto;
  @include media-breakpoint-down(md) {
    background-size: auto $header-height;
  }
  padding-top: $navbar-height;
  min-height: $header-height;
  padding-bottom: $navbar-height;
  &.full-height {
    min-height: auto;
  }
}

$transparent-bg: rgba($gray-700, 0.1);

.btn-light, .btn-dark {
  background-color: $transparent-bg;
  border-color: $transparent-bg;
  outline-color: $transparent-bg;
}

img {
  box-shadow: $toast-box-shadow;
}

.back-button {
  margin-top: 0.45em;
}

</style>
