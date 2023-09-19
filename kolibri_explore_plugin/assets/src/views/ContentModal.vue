<template>

  <b-modal
    id="content-modal"
    v-model="showingModal"
    :modalClass="contentModalClass"
    :size="size"
    centered
    busy
    :title="content.title"
    headerCloseVariant="light"
  >
    <ContentItem isDark :contentNode="content" />
  </b-modal>

</template>


<script>

  import { mapState } from 'vuex';
  import { responsiveMixin } from 'ek-components';
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
    mixins: [responsiveMixin],
    data() {
      return {
        showingModal: false,
      };
    },
    computed: {
      ...mapState('topicsTree', ['content', 'channel']),
      size() {
        if (this.xl) {
          return 'xl';
        }
        return 'lg';
      },
      contentModalClass() {
        return ['content-modal', `content-modal-kind--${this.content.kind}`];
      },
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
      window.addEventListener('contextmenu', this.onRightClick);
    },
    beforeDestroy() {
      window.removeEventListener('message', this.onMessage);
      window.removeEventListener('contextmenu', this.onRightClick);
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
      onRightClick(event) {
        // Prevent user right-click in this modal:
        event.preventDefault();
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
    border: 0 !important;
  }

  ::v-deep .content-renderer .bg-light {
    padding-right: $spacer !important;
    padding-left: $spacer !important;
    background-color: white !important;
  }

  ::v-deep .modal-footer {
    display: none;
  }

  ::v-deep .modal-content .requirements,
  ::v-deep .modal-content .paragraph {
    color: $gray-700 !important;
  }

  ::v-deep .modal-body {
    padding-top: 0;
    border-bottom-right-radius: $modal-content-border-radius;
    border-bottom-left-radius: $modal-content-border-radius;
  }

  ::v-deep .content-modal-kind--zim {
    .modal-header {
      padding: 0.5rem 1rem;
    }

    .modal-title {
      display: none;
    }

    .modal-body {
      padding-right: 0;
      padding-bottom: 0;
      padding-left: 0;
      // We need to use overflow: hidden for the existing rounded corners to
      // mask the content renderer.
      overflow: hidden;
    }
  }

  ::v-deep .modal-content .framework-perseus {
    padding-bottom: 0;
  }

  ::v-deep .modal-content .perseus {
    // Don't show two columns layout on custom modal
    .pure-u-12-24 {
      width: 100%;
    }
  }

</style>
