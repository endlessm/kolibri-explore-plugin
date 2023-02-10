<template>
  <b-card
    overlay
    noBody
    :class="{ active: selected }"
    :footerClass="packId"
  >
    <b-link
      v-if="!selected"
      href="#"
      class="stretched-link"
      @click="onClick"
    />

    <div class="pack-card-background" :class="packId"></div>

    <template #footer>
      <h5>{{ title }}</h5>
      <div v-if="selected">
        <p>
          {{ subTitle }}
        </p>
        <b-button variant="primary" @click="onChoosePack">
          Choose
        </b-button>
      </div>
    </template>
  </b-card>
</template>

<script>
  export default {
    name: 'PackCard',
    emits: ['click', 'choosePack'],
    props: {
      selected: {
        type: Boolean,
        default: false,
      },
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
      onChoosePack() {
        this.$emit('choosePack');
      },
    },
  }
</script>

<style lang="scss" scoped>
@import '../styles.scss';

// This number should overpass the footer height when unfolded (card selected)
$pack-card-height: 250px;

.card {
  border-radius: $border-radius-lg;
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
  color: $white;
  position: absolute;
  width: 100%;
  bottom: 0;
  &.explorer { background-color: #606530; }
  &.artist { background-color: #C84070; }
  &.scientist { background-color: #5E94AA; }
  &.inventor { background-color: #494562; }
  &.athlete { background-color: #EB492C; }
  &.curious { background-color: #D19012; }
}

</style>
