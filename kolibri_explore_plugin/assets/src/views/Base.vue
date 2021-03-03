<template>

  <div
    ref="mainWrapper"
    class="main-wrapper"
  >
    <div v-if="!loading" class="explore-main-content">
      <div class="explore-buttons">
        <b-button
          v-if="back"
          class="back-button"
          @click="goBack()"
        >
          <b-icon-chevron-left />
        </b-button>
      </div>

      <slot></slot>
    </div>
  </div>

</template>


<script>

  import { mapState } from 'vuex';

  export default {
    name: 'Base',
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

  .back-button {
    width: 50px;
    height: 50px;
    padding: 7px 10px;
    text-align: center;
    border-radius: 25px;
  }

</style>
