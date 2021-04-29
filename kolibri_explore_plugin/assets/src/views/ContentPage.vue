<template>

  <div class="main-wrapper" :style="getStyle()">
    <div class="page-wrapper">
      <ContentLightbox @close="onClose()" />
    </div>
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import ContentLightbox from './ContentLightbox';

  export default {
    name: 'ContentPage',
    metaInfo() {
      return {
        title: this.$tr('documentTitle', {
          contentTitle: this.content.title,
          channelTitle: this.channel.title,
        }),
      };
    },
    components: {
      ContentLightbox,
    },
    computed: {
      ...mapState('topicsTree', ['content', 'appMetadata']),
      ...mapState('topicsTree', {
        contentId: state => state.content.content_id,
        channelId: state => state.content.channel_id,
      }),
    },
    created() {
      return this.initSessionAction({
        channelId: this.channelId,
        contentId: this.contentId,
        contentKind: this.content.kind,
      }).then(() => {
        this.sessionReady = true;
        this.setWasIncomplete();
      });
    },
    beforeDestroy() {
      this.stopTracking();
    },
    methods: {
      getStyle() {
        return {
          backgroundImage: this.appMetadata.contentBackgroundImage,
          backgroundColor: this.appMetadata.contentBackgroundColor,
        };
      },
      onClose() {
        if (window.history.length > 1) {
          this.$router.go(-1);
        }
      },
    },
    $trs: {
      documentTitle: '{ contentTitle } - { channelTitle }',
    },
  };

</script>


<style lang="scss" scoped>

  .main-wrapper {
    height: 100vh;
    background-size: cover;
  }

  .page-wrapper {
    max-width: 1000px;
    padding: 32px;
    margin-right: auto;
    margin-left: auto;
  }

</style>
