<template>
  <div class="text-muted">
    <Footer>
      <template #left>
        <ChannelCard :channel="channel" variant="infoCard" />
        <p v-if="creditsLine" class="mt-3">
          {{ creditsLine }}
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
    ...mapState(['channel', 'tree', 'isEndlessApp']),
    logo() {
      return EndlessLogo;
    },
    creditsLine() {
      return this.tree[0]['license_owner'];
    },
  },
};
</script>

<style lang="scss" scoped>
  .endless-seal {
    font-size: small;
  }
</style>
