<template>
  <div class="search-row">
    <b-container class="py-4">
      <b-input-group>
        <template #prepend>
          <b-input-group-text>
            <b-spinner v-if="loading" small label="Spinning" />
            <b-icon-search v-else />
          </b-input-group-text>
        </template>
        <template #append>
          <b-button
            v-if="value"
            variant="link"
            class="text-muted"
            @click="clearSearchInput"
          >
            <b-icon-x-circle scale="2" />
          </b-button>
        </template>
        <input
          ref="searchInput"
          class="form-control"
          placeholder="Search"
          :disabled="loading"
          :value="value"
          @input="updateValue($event.target.value)"
        >
      </b-input-group>
    </b-container>
  </div>
</template>

<script>
  import _ from 'underscore';

  export default {
    name: 'SearchBar',
    props: {
      value: {
        type: String,
        required: true,
      },
      debounce: {
        type: Number,
        default: 500,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    created() {
      this.updateValue = _.debounce(this.inputUpdated, this.debounce);
    },
    mounted() {
      this.$nextTick(() => {
        this.focusSearchInput();
      });
    },
    methods: {
      inputUpdated(value) {
        this.$emit('input', value);
      },
      focusSearchInput() {
        this.$refs.searchInput.focus();
      },
      clearSearchInput() {
        this.$emit('clear-input');
      }
    },
  };
</script>

<style lang="scss" scoped>
@import '../styles.scss';

.form-control {
  background-color: transparent;
  border: none;
  &:active, &:focus {
    background-color: transparent;
    border: none;
    box-shadow: none;
  }
  font-size: $h5-font-size;
}

.input-group-text {
  border: none;
  background-color: transparent;
}

.search-row {
  background-color: $white;
  margin-bottom: $jumbotron-padding;
}

</style>
