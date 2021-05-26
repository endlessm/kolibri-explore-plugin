<template>

  <b-container class="channels mb-3 mt-3">
    <b-card-group
      v-for="(row, index) in rows"
      :key="`row-${index}`"
      class="card-row"
      deck
    >
      <ChannelCard
        v-for="channel in row"
        :key="channel.id"
        :channel="channel"
        @click.native="goToChannel(channel.id)"
      />

      <!-- eslint-disable vue/no-use-v-if-with-v-for -->
      <b-card
        v-for="n in emptyCardsNumber"
        v-if="index === rows.length - 1"
        :key="n"
        class="invisible"
      />
    </b-card-group>

  </b-container>

</template>


<script>

  import { mapState } from 'vuex';
  import commonCoreStrings from 'kolibri.coreVue.mixins.commonCoreStrings';
  import { ChannelCard } from 'eos-components';
  import _ from 'underscore';
  import { PageNames } from '../constants';

  export default {
    name: 'ChannelsPage',
    components: {
      ChannelCard,
    },
    mixins: [commonCoreStrings],
    props: {
      columns: {
        type: Number,
        default: 3,
      },
    },
    computed: {
      ...mapState('topicsRoot', { channels: 'rootNodes' }),
      rows() {
        return _.chunk(this.channels, this.columns);
      },
      emptyCardsNumber() {
        return this.rows.length % this.columns;
      },
    },
    methods: {
      goToChannel(channelId) {
        this.$router.push({
          name: PageNames.TOPICS_CHANNEL,
          params: { channel_id: channelId },
        });
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  .card-row {
    margin-top: $card-deck-margin * 2;
  }

</style>
