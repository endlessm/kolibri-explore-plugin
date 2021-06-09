<template>
  <div class="text-muted">
    <Footer>
      <template #left>
        <ChannelCard :channel="channel" variant="infoCard" />
      </template>
    </Footer>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ChannelFooter',
  computed: {
    ...mapState(['channel']),
  },
};
</script>

<style lang="scss" scoped>
</style>
