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
          <div class="mb-1">
            <span class="font-weight-bold">Best of the Web</span> curated by
          </div>
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
};
</script>

<style lang="scss" scoped>
  .endless-seal {
    font-size: small;
  }
</style>
