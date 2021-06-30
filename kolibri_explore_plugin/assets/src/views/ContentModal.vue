<template>

  <b-modal
    id="content-modal"
    v-model="showingModal"
    size="xl"
    centered
    scrollable
    busy
    :title="content.title"
    headerCloseVariant="light"
  >
    <ContentItem class="text-dark" :content="content" />
  </b-modal>

</template>


<script>

  import { mapState } from 'vuex';
  import {
    hideTopicsContentFromLightbox,
    showTopicsContentInLightbox,
  } from '../modules/topicsTree/handlers';
  import ContentItem from './ContentItem';

  export default {
    name: 'ContentModal',
    metaInfo() {
      return {
        title: this.channel.title,
      };
    },
    components: {
      ContentItem,
    },
    data() {
      return {
        showingModal: false,
      };
    },
    computed: {
      ...mapState('topicsTree', ['content', 'channel']),
    },
    watch: {
      content() {
        this.showingModal = !!this.content.id;
      },
      showingModal() {
        if (!this.showingModal) {
          this.onClose();
        }
      },
    },

    mounted() {
      window.addEventListener('message', this.onMessage);
    },
    beforeDestroy() {
      window.removeEventListener('message', this.onMessage);
    },
    methods: {
      onMessage(event) {
        if (
          !event.data.event ||
          !event.data.nameSpace ||
          event.data.nameSpace !== 'customChannelPresentation'
        ) {
          return;
        }
        if (event.data.event === 'goToContent') {
          this.goToContent(event.data.data);
        }
      },

      goToContent(id) {
        showTopicsContentInLightbox(this.$store, id);
      },
      onClose() {
        hideTopicsContentFromLightbox(this.$store);
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  // This is overriding the Kolibri media player plugin:
  ::v-deep .content-renderer {
    border: 0;
  }

  ::v-deep .modal-footer {
    display: none;
  }

  ::v-deep .modal-body {
    padding-top: 0;
    border-bottom-right-radius: $modal-content-border-radius;
    border-bottom-left-radius: $modal-content-border-radius;
  }

</style>
