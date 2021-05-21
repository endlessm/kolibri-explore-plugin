<template>
  <button @click="count++">
    I was clicked {{ count }} times.
  </button>
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
