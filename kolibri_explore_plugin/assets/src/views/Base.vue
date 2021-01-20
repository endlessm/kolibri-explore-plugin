<template>

  <div
    ref="mainWrapper"
    class="main-wrapper"
  >
    <SideNav
      :navShown="navShown"
      :headerHeight="headerHeight"
      :width="navWidth"
      @toggleSideNav="navShown = !navShown"
    />

    <div v-if="!loading" class="explore-main-content">
      <div class="explore-buttons">
        <KIconButton
          v-if="!back"
          icon="menu"
          size="large"
          appearance="raised-button"
          @click="navShown = !navShown"
        />
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
  import SideNav from 'kolibri.coreVue.components.SideNav';

  export default {
    name: 'Base',
    components: {
      SideNav,
      KIconButton,
    },
    mixins: [responsiveWindowMixin],
    props: {
      back: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        navShown: false,
      };
    },
    computed: {
      headerHeight() {
        return this.windowIsSmall ? 56 : 64;
      },
      navWidth() {
        return this.headerHeight * 4;
      },
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
  }

</style>
