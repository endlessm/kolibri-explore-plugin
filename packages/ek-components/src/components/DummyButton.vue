<template>
  <b-button variant="primary" pill @click="count++">
    I was clicked {{ count }} times.
  </b-button>
</template>

<script>
export default {
  name: 'DummyButton',
  data: function () {
    return {
      count: 0
    }
  },
}
</script>
