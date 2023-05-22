<template>
  <div>
    <b-card-group
      v-for="(row, index) in rows"
      :key="`row-${index}`"
      class="card-row"
      deck
    >
      <EkChannelCard
        v-for="channel in row"
        :key="channel.id"
        :channel="channel"
        :variant="variant"
        @click.native="$emit('card-click', channel.id)"
      />

      <!-- eslint-disable vue/no-use-v-if-with-v-for -->
      <b-card
        v-for="n in (columns - row.length)"
        v-if="index === rows.length - 1"
        :key="n"
        class="invisible"
      />
    </b-card-group>
  </div>
</template>

<script>
  import EkChannelCard from './EkChannelCard';

  export default {
    name: 'EkChannelCardGroup',
    components: {
      EkChannelCard,
    },
    props: {
      rows: {
        type: Array,
        required: true,
      },
      columns: {
        type: Number,
        default: 3,
      },
      variant: {
        type: String,
        default: 'basicCard',
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../styles';

  .card-row {
    margin-top: $card-deck-margin * 2;
  }
</style>
