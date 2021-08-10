<template>
  <div class="text-muted">
    <Footer>
      <template #left>
        <div class="align-items-center d-flex pb-3">
          <ChannelLogo class="mr-3" :channel="channel" size="md" />
          <h6>{{ channel.title }}</h6>
        </div>
        <p class="pt-2">
          {{ channel.description }}
        </p>
      </template>
      <template #right>
        <div v-if="isEndlessApp" class="endless-seal text-right">
          <div class="font-weight-bold mb-1">
            Endless Creator's Spotlight
          </div>
          <img :src="logo" aria-hidden="true">
        </div>
      </template>
    </Footer>
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
