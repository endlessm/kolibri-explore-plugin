<template>

  <div
    ref="mainWrapper"
    class="main-wrapper"
  >
    <div v-if="!loading" class="explore-main-content">
      <div class="explore-buttons">
        <KIconButton
          v-if="back"
          class="right"
          icon="close"
          size="large"
          appearance="raised-button"
          @click="goBack()"
        />
      </div>

      <slot></slot>
    </div>
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import responsiveWindowMixin from 'kolibri.coreVue.mixins.responsiveWindowMixin';
  import KIconButton from 'kolibri-design-system/lib/buttons-and-links/KIconButton';

  export default {
    name: 'Base',
    components: {
      KIconButton,
    },
    mixins: [responsiveWindowMixin],
    props: {
      back: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      ...mapState({
        loading: state => state.core.loading,
      }),
    },
    methods: {
      goBack() {
        if (window.history.length > 1) this.$router.go(-1);
        else this.$router.push('/');
      },
    },
  };

</script>


<style lang="scss" scoped>

  .explore-main-content {
    position: relative;
  }

  .explore-buttons {
    position: absolute;
    top: 10px;
    left: 5px;

    /* Just below the sidenav */
    z-index: 14;
  }

</style>
