<template>
  <ContentLink :node="node">
    <b-carousel-slide>
      <template #img>
        <b-card>
          <template>
            <div class="img" :style="backgroundStyle">
              <PlayButton :node="node" :label="label" @click="goToContent(node)" />
            </div>
            <b-card-text>
              <CardBody :node="node" :titleLines="5" />
            </b-card-text>
          </template>
        </b-card>
      </template>
    </b-carousel-slide>
  </ContentLink>
</template>

<script>
import cardMixin from '@/components/mixins/cardMixin';
import { goToContent } from 'kolibri-api';

export default {
  name: 'CarouselCard',
  mixins: [cardMixin],
  props: {
    node: Object,
  },
  computed: {
    backgroundStyle() {
      return {
        backgroundImage: `url("${this.thumbnail}")`,
      };
    },
  },
  methods: {
    goToContent,
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.badge {
  font-size: $font-size-base;
}
.card {
  border-radius: $border-radius-lg;
  padding-left: 50%;
  position: relative;
}
.img {
  border-top-left-radius: $border-radius-lg;
  border-bottom-left-radius: $border-radius-lg;
  position: absolute;
  left: 0;
  bottom: 0;
  top: 0;
  width: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: left center;
}

::v-deep .card-content {
  min-height: card-body-height(5);
}
</style>
