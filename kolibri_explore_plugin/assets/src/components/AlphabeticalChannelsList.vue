<template>

  <b-container class="channels pb-5">
    <h5 class="text-muted">
      {{ $tr('channelsAlphabeticalTitle') }}
    </h5>
    <EkChannelCardGroup
      class="pb-4"
      :rows="chunk(orderedChannels)"
      :columns="columns"
      @card-click="goToChannel"
    />
  </b-container>

</template>


<script>

  import { mapState } from 'vuex';
  import _ from 'lodash';
  import { responsiveMixin } from 'ek-components';
  import navigationMixin from '../mixins/navigationMixin';

  export default {
    name: 'AlphabeticalChannelsList',
    mixins: [navigationMixin, responsiveMixin],

    computed: {
      ...mapState('topicsRoot', { rootNodes: 'rootNodes' }),
      orderedChannels() {
        return [...this.rootNodes].sort((channelA, channelB) =>
          channelA.title.localeCompare(channelB.title)
        );
      },
      columns() {
        if (this.xs) {
          return 1;
        }

        if (this.sm || this.md) {
          return 2;
        }

        return 3;
      },
    },

    methods: {
      chunk(channels) {
        return _.chunk(channels, this.columns);
      },
    },

    $trs: {
      channelsAlphabeticalTitle: {
        message: 'Channels from A-Z',
        context: 'Title of section with channels in alphabetical order',
      },
    },
  };

</script>
