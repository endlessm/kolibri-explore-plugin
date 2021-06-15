<template>

  <div>
    <b-modal
      id="content-modal"
      v-model="showingModal"
      size="xl"
      centered
      busy
      :title="content.title"
      headerBgVariant="dark"
      headerTextVariant="light"
      bodyBgVariant="dark"
      bodyTextVariant="light"
      footerBgVariant="dark"
      footerTextVariant="light"
      headerBorderVariant="dark"
      footerBorderVariant="dark"
    >
      <ContentItem class="text-dark" :content="content" />
    </b-modal>
    <CustomChannelPresentationApp />
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import { hideTopicsContentFromLightbox } from '../modules/topicsTree/handlers';
  import ContentItem from './ContentItem';
  import CustomChannelPresentationApp from './CustomChannelPresentationApp';

  export default {
    name: 'CustomChannelsPage',
    metaInfo() {
      return {
        title: this.channel.title,
      };
    },
    components: {
      ContentItem,
      CustomChannelPresentationApp,
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
    methods: {
      onClose() {
        hideTopicsContentFromLightbox(this.$store);
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

  ::v-deep .modal-footer {
    display: none;
  }

  ::v-deep .modal-body {
    padding-top: 0;
    border-bottom-right-radius: $modal-content-border-radius;
    border-bottom-left-radius: $modal-content-border-radius;
  }

</style>
