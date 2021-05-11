<template>

  <div>
    <ContentLightbox
      v-if="content.id"
      :content="content"
      @close="onClose()"
    />
    <CustomChannelPresentationApp />
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import { hideTopicsContentFromLightbox } from '../modules/topicsTree/handlers';
  import ContentLightbox from './ContentLightbox';
  import CustomChannelPresentationApp from './CustomChannelPresentationApp';

  export default {
    name: 'CustomChannelsPage',
    metaInfo() {
      return {
        title: this.channel.title,
      };
    },
    components: {
      ContentLightbox,
      CustomChannelPresentationApp,
    },
    computed: {
      ...mapState('topicsTree', ['content', 'channel']),
    },
    methods: {
      onClose() {
        hideTopicsContentFromLightbox(this.$store);
      },
    },
  };

</script>
