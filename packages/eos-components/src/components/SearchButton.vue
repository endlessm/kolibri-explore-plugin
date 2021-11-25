<template>
  <b-button
    pill
    class="pl-2 search-button"
    variant="outline-dark"
    :to="to"
    @click="$emit('click')"
  >
    <b-icon-search class="mx-1" />
    <span class="d-md-inline d-none ml-1">Search</span>
  </b-button>
</template>

<script>
  export default {
    name: 'SearchButton',
    props: {
      to: {
        type: [Object, String],
        required: false,
        default: null,
      },
    },
  };
</script>
