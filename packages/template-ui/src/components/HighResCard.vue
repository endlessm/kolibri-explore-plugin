<template>
  <b-card
    :imgSrc="thumbnail"
    :imgAlt="node.title"
    :class="{
      shadow: isHovered,
    }"
    overlay
  >
    <PlayButton
      v-if="node.kind !== 'topic'"
      :node="node"
      :label="label"
      @click="goToContent(node)"
    />
    <ContentLink :node="node" :label="label" @isHovered="(hovered) => isHovered = hovered">
      <b-card-text class="card-img-overlay">
        <div class="body-wrapper">
          <CardBody :node="node" :subtitle="subtitle" />
        </div>
      </b-card-text>
    </ContentLink>
  </b-card>
</template>

<script>
import cardMixin from '@/components/mixins/cardMixin';
import { goToContent } from 'kolibri-api';

export default {
  name: 'HighResCard',
  mixins: [cardMixin],
  props: {
    node: Object,
    subtitle: String,
  },
  data() {
    return {
      isHovered: false,
    };
  },
  methods: {
    goToContent,
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.card {
  transition: all ease .4s;
  border: 0;
  &:hover {
    color: $primary;
  }
}

.card-img-overlay {
  transition: all ease .4s;
  color: $white;
  display: flex;
  align-items: flex-end;
  padding: 0;
  &:hover {
    color: $primary;
  }
  .body-wrapper {
    background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 15%);
    width: 100%;
    padding: $card-img-overlay-padding;
  }
}

</style>
