<template>
  <div>
    <b-button
      v-for="button in buttonsVisible"
      :key="button"
      pill
      size="sm"
      variant="primary"
      class="mr-2"
      @click="$emit('click', button)"
    >
      {{ button }}
    </b-button>
    <b-dropdown
      v-if="buttonsHidden.length"
      ref="dropdown"
      size="sm"
      class="mr-2"
      variant="primary"
      text="···"
      noCaret
      right
    >
      <div class="d-flex filter-dropdown flex-column">
        <b-dropdown-header>
          {{ title }}
          <b-button-close @click="close" />
        </b-dropdown-header>
        <b-dropdown-divider class="my-1" />
        <div class="filter-content flex-fill">
          <b-button
            v-for="button in buttonsHidden"
            :key="button"
            pill
            size="sm"
            variant="primary"
            class="mr-2 mt-2"
            @click="$emit('click', button)"
          >
            {{ button }}
          </b-button>
        </div>
      </div>
    </b-dropdown>
  </div>
</template>

<script>
  import responsiveMixin from './mixins/responsiveMixin';

  export default {
    name: 'ButtonsBar',
    mixins: [responsiveMixin],
    props: {
      buttons: Array,
      title: String,
    },
    computed: {
      numberOfButtons() {
        if (this.xs) {
          return 0;
        }
        if (this.sm) {
          return 2;
        }
        if (this.md) {
          return 3;
        }

        return this.buttons.length;
      },
      buttonsVisible() {
        return this.buttons.slice(0, this.numberOfButtons);
      },
      buttonsHidden() {
        return this.buttons.slice(this.numberOfButtons);
      },
    },
    methods: {
      close() {
        this.$refs.dropdown.hide(true);
      },
    },
  };
</script>

<style lang="scss" scoped>
  @import '../styles';
  .b-dropdown {
    ::v-deep .dropdown-toggle {
      border-radius: $rounded-pill;
    }
  }
</style>
