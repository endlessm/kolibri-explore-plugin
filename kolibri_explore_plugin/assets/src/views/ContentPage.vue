<template>

  <div class="main-wrapper" :style="getStyle()">
    <div class="page-wrapper">
      <PageHeader
        :title="content.title"
        :contentType="content.kind"
        dir="auto"
      />
      <ContentItem :content="content" />
    </div>
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import ContentItem from './ContentItem';
  import PageHeader from './PageHeader';

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
      ContentItem,
      PageHeader,
    },
    computed: {
      ...mapState('topicsTree', ['channel', 'content', 'appMetadata']),
    },
    methods: {
      getStyle() {
        return {
          backgroundImage: this.appMetadata.contentBackgroundImage,
          backgroundColor: this.appMetadata.contentBackgroundColor,
        };
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
