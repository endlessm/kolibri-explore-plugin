<template>

  <div v-if="content">
    <ContentItem isDark expand :contentNode="content" />
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import { ContentNodeResource } from '../apiResources';
  import ContentItem from './ContentItem';

  export default {
    name: 'ContentPage',
    components: {
      ContentItem,
    },
    data() {
      return {
        content: null,
      };
    },
    computed: {
      ...mapState(['contentId']),
    },
    mounted() {
      ContentNodeResource.fetchModel({ id: this.contentId }).then(content => {
        this.content = content;
      });
    },
  };

</script>
