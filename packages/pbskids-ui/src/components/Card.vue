<template>
  <b-card
    :img-src="thumbnail"
    :img-alt="node.title"
    class="p-2"
    no-body
  />
</template>

<script>
import { getThumbnail } from 'kolibri-api';

export default {
  props: ['node'],
  data() {
    return {
      thumbnail: null,
    };
  },
  computed: {
  },
  methods: {
    async getThumbnail() {
      if (this.node.thumbnail) {
        this.thumbnail = this.node.thumbnail;
        return;
      }
      const thumbnail = await getThumbnail(this.node);
      this.thumbnail = thumbnail;
      // return;
    },
  },
  created() {
    this.getThumbnail();
  },
};
</script>
