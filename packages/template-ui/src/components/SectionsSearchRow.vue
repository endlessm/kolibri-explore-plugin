<template>
  <b-container class="my-4">
    <MainSections>
      <b-button
        class="font-weight-bold my-1 text-nowrap"
        size="sm"
        variant="link"
        to="/search"
      >
        <MagnifyIcon class="mr-1" />
        Search Keywords
      </b-button>
    </MainSections>
  </b-container>
</template>

<script>
import MagnifyIcon from 'vue-material-design-icons/Magnify.vue';

export default {
  name: 'SectionsSearchRow',
  components: { MagnifyIcon },
};
</script>
