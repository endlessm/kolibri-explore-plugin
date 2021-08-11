<template>
  <div class="text-muted">
    <Footer>
      <template #left>
        <ChannelCard :channel="channel" variant="infoCard" />
      </template>
      <template #right>
        <div v-if="isEndlessApp" class="endless-seal text-right">
          <div class="mb-1">
            <span class="font-weight-bold">Best of the Web</span> curated by
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
