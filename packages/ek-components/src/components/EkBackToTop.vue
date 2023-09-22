<template>
  <transition name="fade">
    <b-button
      v-if="hasScrolled"
      v-b-hover="handleHover"
      variant="primary"
      class="back-to-top rounded-circle"
      :class="{
        'shadow-sm': !isHovered,
        'shadow': isHovered,
      }"
      @click="goToTop"
    >
      <ChevronUpIcon />
    </b-button>
  </transition>
</template>

<script>
  import _ from 'lodash';
  import ChevronUpIcon from 'vue-material-design-icons/ChevronUp.vue';

  export default {
    name: 'EkBackToTop',
    components: { ChevronUpIcon },
    data() {
      return {
        hasScrolled: false,
        isHovered: false,
      };
    },
    created() {
      this.debouncedScroll = _.debounce(this.onScroll, 100);
      window.addEventListener('scroll', this.debouncedScroll);
    },
    destroyed() {
      window.removeEventListener('scroll', this.debouncedScroll);
    },
    methods: {
      goToTop() {
        window.scrollTo({top: 0, behavior: 'smooth'});
      },
      handleHover(hovered) {
        this.isHovered = hovered;
      },
      onScroll() {
        this.hasScrolled = window.scrollY !== 0;
      },
    },
  }
</script>

<style lang="scss" scoped>
  @import '../styles.scss';

  .back-to-top {
    position: fixed;
    bottom: $spacer;
    right: $spacer;
    z-index: 7;
    // Remove 2px border from the actual size to match the slidable cards row:
    width: $circled-button-size + 4px;
    height: $circled-button-size + 4px;
    padding: 0;
  }

  .fade-enter-active, .fade-leave-active {
    @include transition($transition-fade);
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
