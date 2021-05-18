<template>
  <ContentLink :node="node">
    <b-carousel-slide>
      <template #img>
        <b-card>
          <template>
            <div class="img" :style="backgroundStyle">
              <CardMediaType :node="node" />
            </div>
            <b-card-text>
              <CardBody :node="node" :title-lines="5" />
            </b-card-text>
          </template>
        </b-card>
      </template>
    </b-carousel-slide>
  </ContentLink>
</template>

<script>
import cardMixin from '@/components/mixins/cardMixin';

export default {
  props: ['node'],
  mixins: [cardMixin],
  computed: {
    backgroundStyle() {
      return {
        backgroundImage: `url("${this.thumbnail}")`,
      };
    },
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
