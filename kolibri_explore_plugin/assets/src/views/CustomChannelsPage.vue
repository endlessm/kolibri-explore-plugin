<template>

  <div>
    <div v-if="isLightboxEnabled" class="lightbox-overlay">
      <div class="lightbox">
        <ContentLightbox @close="onClose()" />
      </div>
    </div>
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
      isLightboxEnabled() {
        // Check if the content state is not an empty {} object
        return 'id' in this.content;
      },
    },
    methods: {
      onClose() {
        hideTopicsContentFromLightbox(this.$store);
      },
    },
  };

</script>


<style lang="scss" scoped>

  .lightbox-overlay {
    /* Overlay everything */
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    /* Above the sidenav */
    z-index: 16;

    /* With a semi transparent background */
    background: rgba(0, 0, 0, 0.5);
  }

  .lightbox {
    /* Center in overlay */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

</style>
