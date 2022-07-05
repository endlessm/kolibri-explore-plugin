<template>
  <b-card
    :title="title"
    :subTitle="subTitle"
    :borderVariant="selected ? 'primary' : 'default'"
    :class="{ active: selected, disabled: disabled }"
    titleTag="h6"
    subTitleTag="h4"
    imgBottom
    :imgSrc="img"
  >
    <!-- eslint-disable vue/no-v-html -->
    <p class="text-muted">
      {{ text }} <br v-if="secondaryText"> {{ secondaryText }}
    </p>
    <slot></slot>

    <b-link
      href="#"
      class="stretched-link"
      @click="onClick"
    />
    <span
      v-if="selected"
      class="icon-wrapper text-primary"
    >
      <CheckCircleIcon />
    </span>
  </b-card>
</template>

<script>
  import CheckCircleIcon from 'vue-material-design-icons/CheckCircle.vue';

  export default {
    name: 'WelcomeCard',
    components: { CheckCircleIcon },
    emits: ['click'],
    props: {
      selected: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        required: true,
      },
      subTitle: {
        type: String,
        default: '',
      },
      text: {
        type: String,
        default: '',
      },
      secondaryText: {
        type: String,
        default: '',
      },
      img: {
        type: String,
        default: '',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      onClick() {
        if (!this.disabled) {
          this.$emit('click');
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import '../styles.scss';

.card {
  border: $border-width solid $dark;
  border-radius: $border-radius-lg;
  background-color: $gray-200;
  .card-title {
    color: $dark;
  }
  &.active .card-title {
    color: $primary;
  }
  .icon-wrapper {
    position: absolute;
    right: map-get($spacers, 1);
    top: map-get($spacers, 1);
  }
  &.disabled {
    opacity: $disabled-card-opacity;
  }
}

.card-title {
  text-transform: capitalize;
}
</style>
