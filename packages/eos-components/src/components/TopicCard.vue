<template>
  <b-card
    noBody
    class="my-2 rounded-lg"
    :class="{
      shadow: !isHovered,
      'shadow-lg': isHovered,
    }"
  >
    <ContentLink :url="url" @isHovered="(hovered) => isHovered = hovered">
      <b-card-body>
        <b-card-title>
          <VClamp
            autoresize
            :maxLines="3"
          >
            {{ node.title }}
          </VClamp>
        </b-card-title>
        <b-card-text>
          <VClamp
            autoresize
            :maxLines="5"
          >
            {{ node.description }}
          </VClamp>
        </b-card-text>
        <b-card-sub-title class="text-truncate">
          {{ subtitle }}
        </b-card-sub-title>
      </b-card-body>
    </ContentLink>
  </b-card>
</template>

<script>
import VClamp from 'vue-clamp';

export default {
  name: 'TopicCard',
  components: {
    VClamp,
  },
  props: {
    node: Object,
    subtitle: String,
    url: String,
  },
  data() {
    return {
      isHovered: false,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '../styles.scss';

.card {
  background-color: $primary;
  transition: all ease .4s;
}

.card-body {
  // This 8 is an estimation:
  min-height: card-body-height(8);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title, .card-text {
  color: $white;
}

.card-text {
  flex-grow: 3;
}

.card-subtitle {
  color: $black !important;
}

</style>
