<template>
  <div class="search-row">
    <b-container class="py-4">
      <b-input-group>
        <template #prepend>
          <b-input-group-text>
            <MagnifyIcon />
          </b-input-group-text>
        </template>
        <template #append>
          <b-button
            v-if="value"
            variant="link"
            class="text-primary"
            @click="clearSearchInput"
          >
            <CloseIcon />
          </b-button>
        </template>
        <input
          ref="searchInput"
          class="form-control"
          :placeholder="$tr('searchPlaceholder')"
          :disabled="loading"
          :value="value"
          @keyup.enter="inputUpdated($event.target.value)"
          @input="updateValue($event.target.value)"
        >
      </b-input-group>
    </b-container>
    <b-progress
      v-if="progress < 100"
      :value="progress"
      :max="100"
      height="2px"
      variant="primary"
    />
  </div>
</template>

<script>
  import _ from 'lodash';
  import CloseIcon from 'vue-material-design-icons/CloseCircleOutline.vue';
  import MagnifyIcon from 'vue-material-design-icons/Magnify.vue';
  import { SearchBarDebounce } from '../constants.js';

  export default {
    name: 'EkSearchBar',
    components: {
      CloseIcon,
      MagnifyIcon,
    },
    props: {
      value: {
        type: String,
        required: true,
      },
      debounce: {
        type: Number,
        default: SearchBarDebounce,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      progress: {
        type: Number,
        default: 100,
      },
    },
    watch: {
      loading() {
        this.$nextTick(() => {
          this.focusSearchInput();
        });
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
    activated() {
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
        this.focusSearchInput();
      }
    },
    $trs: {
      searchPlaceholder: {
        message: 'Type keywords to search',
        context: 'Placeholder text in the search bar',
      },
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
  &:disabled {
    background-color: $white;
    color: $text-muted;
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
