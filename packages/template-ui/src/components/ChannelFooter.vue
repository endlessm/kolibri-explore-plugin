<template>
  <div class="text-muted">
    <EkFooter>
      <template #left>
        <div class="align-items-center d-flex pb-3">
          <EkChannelLogo class="mr-3" :channel="channel" size="md" />
          <h6>{{ channel.name }}</h6>
        </div>
        <p class="pt-2">
          {{ channel.description }}
        </p>
      </template>
      <template #right>
        <div v-if="isEndlessApp" class="endless-seal text-right">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="mb-1" v-html="$tr('bestOfTheWeb')"></div>
          <img :src="logo" aria-hidden="true">
        </div>
      </template>
    </EkFooter>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import EndlessLogo from '@/assets/EndlessLogoFull.svg';

export default {
  name: 'ChannelFooter',
  computed: {
    ...mapState(['channel', 'isEndlessApp']),
    logo() {
      return EndlessLogo;
    },
  },
  $trs: {
    bestOfTheWeb: {
      // FIXME: This isn’t translatable to languages where the logo can’t be a suffix,
      // or RTL languages.
      message: '<strong>Best of the Web</strong> curated by ',
      context: 'Footer curation message. The Endless Key logo is displayed just after the end of the sentence',
    },
  },
};
</script>

<style lang="scss" scoped>
  .endless-seal {
    font-size: small;
  }
</style>
