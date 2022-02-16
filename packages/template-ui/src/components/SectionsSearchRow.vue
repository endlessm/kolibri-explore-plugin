<template>
  <b-container class="my-4">
    <MainSections>
      <b-button
        class="font-weight-bold my-1 text-nowrap"
        size="sm"
        variant="link"
        to="/search"
      >
        <MagnifyIcon :size="iconSize" class="mr-1" />
        Search Keywords
      </b-button>
    </MainSections>
  </b-container>
</template>

<script>
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue';
import { constants } from 'eos-components';

export default {
  name: 'SectionsSearchRow',
  components: { MagnifyIcon },
  computed: {
    iconSize() {
      return constants.KeywordIconSize;
    },
  },
};
</script>
