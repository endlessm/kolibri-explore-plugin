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
      <PlayButton
        v-if="node.kind"
        size="lg"
        block
        :kind="node.kind"
        :style="buttonStyle"
        class="mt-3 mx-auto play-button py-2"
        @click="goToContent()"
      />
    </b-card>
  </b-link>
</template>

<script>
import { cardMixin } from 'eos-components';
import { mapGetters } from 'vuex';

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
    };
  },
  computed: {
    ...mapGetters([
      'isSimpleBundle',
    ]),
    buttonStyle() {
      const maxWidth = this.imageSize >= 210 ? this.imageSize : 210;
      return {
        maxWidth: `${maxWidth}px`,
      };
    },
    cardStyle() {
      return {
        maxWidth: `${this.imageSize + 40}px`,
        minWidth: '300px',
      };
    },
  },
  watch: {
    thumbnail() {
      const img = new Image();
      img.src = this.thumbnail;
      img.onload = () => {
        this.imageSize = img.width;
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
}

a:hover {
  text-decoration: none;
}

.content-image img,
.content-image .btn {
  min-width: 210px;
}

</style>
