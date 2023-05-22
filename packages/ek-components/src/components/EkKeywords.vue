<template>
  <span>
    <b-button
      v-for="w in words"
      :key="w"
      pill
      variant="outline-primary"
      class="mx-1 pr-1 py-1"
      @click="$emit('click', w)"
    >
      {{ w }}
      <slot>
        <CloseIcon :size="iconSize" class="ml-2" />
      </slot>
    </b-button>
  </span>
</template>

<script>
import CloseIcon from 'vue-material-design-icons/CloseCircle.vue';
import { KeywordIconSize } from '../constants.js'

export default {
  name: 'EkKeywords',
  components: {
    CloseIcon,
  },
  props: {
    words: {
      type: Array,
      required: true,
    },
  },
  computed: {
    iconSize() {
      return KeywordIconSize;
    },
  },
};
</script>
