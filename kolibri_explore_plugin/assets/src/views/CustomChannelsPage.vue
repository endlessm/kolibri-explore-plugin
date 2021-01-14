<template>

  <div>
    <CustomChannelPresentationApp />
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import CustomChannelPresentationApp from './CustomChannelPresentationApp';

  export default {
    name: 'CustomChannelsPage',
    metaInfo() {
      return {
        title: this.channel.title,
      };
    },
    components: {
      CustomChannelPresentationApp,
    },
    computed: {
      ...mapState('topicsTree', { channel: 'channel' }),
    },
  };

</script>
