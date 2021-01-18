<template>

  <div class="content-grid">
    <ContentCard
      v-for="content in contents"
      :key="content.id"
      class="grid-item"
      :isMobile="windowIsSmall"
      :title="content.title"
      :thumbnail="content.thumbnail"
      :kind="content.kind"
      :progress="content.progress || 0"
      :link="genContentLink(content.id, content.kind)"
      :contentId="content.content_id"
    />
  </div>

</template>


<script>

  import { validateLinkObject } from 'kolibri.utils.validators';
  import responsiveWindowMixin from 'kolibri.coreVue.mixins.responsiveWindowMixin';
  import ContentCard from './ContentCard';

  export default {
    name: 'ContentCardGroupGrid',
    components: {
      ContentCard,
    },
    mixins: [responsiveWindowMixin],
    props: {
      contents: {
        type: Array,
        required: true,
      },
      genContentLink: {
        type: Function,
        validator(value) {
          return validateLinkObject(value(1, 'exercise'));
        },
        /* eslint-disable no-empty-function */
        default: () => {},
        required: false,
      },
    },
    data: () => ({
      sharedContentId: null,
      uniqueId: null,
    }),
  };

</script>


<style lang="scss" scoped>

  $gutters: 16px;

  .grid-item {
    margin-right: $gutters;
    margin-bottom: $gutters;
  }

</style>
