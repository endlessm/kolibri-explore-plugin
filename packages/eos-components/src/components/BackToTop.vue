<template>
  <transition name="fade">
    <b-link
      v-if="hasScrolled"
      class="back-to-top"
      @click="goToTop"
    >
      <ChevronUpCircle :size="50" />
    </b-link>
  </transition>
</template>

<script>
  import _ from 'underscore';
  import ChevronUpCircle from 'vue-material-design-icons/ChevronUpCircle.vue';

  export default {
    name: 'BackToTop',
    components: { ChevronUpCircle },
    data() {
      return {
        hasScrolled: false,
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
    z-index: $zindex-fixed;
  }

  .fade-enter-active, .fade-leave-active {
    @include transition($transition-fade);
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
