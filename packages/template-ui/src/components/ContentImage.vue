<template>
  <b-link @click="goToContent()">
    <b-card
      class="content-image rounded-lg"
      :class="{ 'mx-auto': isSimpleBundle }"
      :style="cardStyle"
    >
      <b-img
        fluid
        :src="thumbnail"
        :alt="node.title"
        class="border d-block mx-auto rounded"
      />
      <EkPlayButton
        v-if="node.kind"
        size="lg"
        :kind="node.kind"
        :enabled="node.available"
        :style="buttonStyle"
        class="mt-3 mx-auto py-2 w-100"
        @click="goToContent()"
      />
    </b-card>
  </b-link>
</template>

<script>
import { cardMixin } from 'ek-components';
import { mapGetters } from 'vuex';
import { cardSpacerX, contentImageMinWidth } from '../styles.scss';

export default {
  name: 'ContentImage',
  mixins: [cardMixin],
  props: {
    node: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      imageSize: 0,
      image: new Image(),
    };
  },
  computed: {
    ...mapGetters([
      'isSimpleBundle',
    ]),
    buttonStyle() {
      const min = contentImageMinWidth;
      const image = `${this.imageSize}px`;
      const maxWidth = image >= min ? image : min;
      return {
        maxWidth,
      };
    },
    cardStyle() {
      const margin = cardSpacerX;
      return {
        maxWidth: `calc(${this.imageSize}px + ${margin})`,
      };
    },
  },
  watch: {
    thumbnail() {
      // Cancel previous onload events
      this.image.onload = null;
      this.image.src = this.thumbnail;
      // Wait for thumbnail to load to get the image width
      this.image.onload = () => {
        this.imageSize = this.image.width;
      };
    }
  },
  methods: {
    goToContent() {
      window.kolibri.navigateTo(this.node.id);
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.card {
  box-shadow: $box-shadow;
  min-width: $content-card-min-width;
}

.content-image img,
.content-image .btn {
  min-width: $content-image-min-width;
}

</style>
