<template>
  <b-card
    overlay
    noBody
  >
    <b-link
      href="#"
      class="stretched-link"
      @click="onClick"
    />

    <div class="pack-card-background" :class="packId"></div>

    <template #footer>
      <h5>{{ title }}</h5>
      <p>
        {{ subTitle }}
      </p>
    </template>
  </b-card>
</template>

<script>
  export default {
    name: 'EkPackCard',
    emits: ['click'],
    props: {
      packId: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      subTitle: {
        type: String,
        default: '',
      },
    },
    methods: {
      onClick() {
        this.$emit('click');
      },
    },
  }
</script>

<style lang="scss" scoped>
@import '../styles.scss';

// This number should overpass the footer height
$pack-card-height: 300px;

.card {
  border-radius: $border-radius-lg;
  transition: all ease .4s;
  margin-bottom: $spacer !important;
  box-shadow: $box-shadow-sm !important;
  &:hover {
    box-shadow: $box-shadow !important;
  }
}

.pack-card-background {
  height: $pack-card-height;
  border-radius: $border-radius-lg;
  background-size: cover;
  background-position: center;
  &.explorer {
    background-image: url('../assets/pack-thumbnails/explorer.jpg');
  }
  &.artist {
    background-image: url('../assets/pack-thumbnails/artist.jpg');
  }
  &.scientist {
    background-image: url('../assets/pack-thumbnails/scientist.jpg');
  }
  &.inventor {
    background-image: url('../assets/pack-thumbnails/inventor.jpg');
  }
  &.athlete {
    background-image: url('../assets/pack-thumbnails/athlete.jpg');
  }
  &.curious {
    background-image: url('../assets/pack-thumbnails/curious.jpg');
  }
}

.card-footer {
  border-radius: 0 0 $border-radius-lg $border-radius-lg !important;
  position: absolute;
  width: 100%;
  bottom: 0;
  background-color: $gray-300;
}

</style>
