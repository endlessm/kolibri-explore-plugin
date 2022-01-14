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
        <CloseIcon :size="20" class="ml-2" />
      </slot>
    </b-button>
  </span>
</template>

<script>
import CloseIcon from 'vue-material-design-icons/CloseCircle.vue';

export default {
  name: 'Keywords',
  components: {
    CloseIcon,
  },
  props: {
    words: {
      type: Array,
      required: true,
    },
  },
};
</script>
