<template>
  <b-card
    :imgSrc="thumbnail"
    :imgAlt="node.title"
    class="p-2"
    noBody
  />
</template>

<script>
import { getThumbnail } from 'kolibri-api';

export default {
  name: 'Card',
  props: ['node'],
  data() {
    return {
      thumbnail: null,
    };
  },
  computed: {
  },
  created() {
    this.getThumbnail();
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
};
</script>
