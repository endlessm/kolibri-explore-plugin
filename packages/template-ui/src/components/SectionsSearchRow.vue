<template>
  <b-container class="my-4">
    <b-row>

      <!-- Section buttons -->
      <b-col>
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
      </b-col>

    </b-row>
  </b-container>
</template>

<script>
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue';
import { constants } from 'ek-components';

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
