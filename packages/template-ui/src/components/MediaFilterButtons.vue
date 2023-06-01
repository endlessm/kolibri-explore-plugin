<template>
  <span :class="variant">
    <EkPlayButton
      v-for="option in filter.options"
      :key="option.kind"
      :size="size"
      :class="classes"
      :kind="option.kind"
      :label="option.label"
      :variant="buttonVariant(filter, option.kind)"
      :enabled="node.available"
      @click="onClick(filter, option)"
    />
  </span>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';

  export default {
    name: 'MediaFilterButtons',
    props: {
      filter: {
        type: Object,
        required: true,
      },
      variant: {
        type: String,
        default: 'default',
      },
      size: {
        type: String,
        default: 'sm',
      },
    },
    computed: {
      ...mapGetters({
        isSelected: 'filters/isSelected',
      }),
      classes() {
        switch (this.variant) {
          case 'flat':
            return 'mr-2';
          default:
            return 'mb-2 mr-2';
        }
      },
      defaultButtonVariant() {
        return this.variant === 'flat' ? 'outline-dark' : 'light';
      },
    },
    methods: {
      ...mapMutations({
        onOptionClick: 'filters/setFilterQuery',
      }),
      buttonVariant(filter, option) {
        return this.isSelected(filter, option) ? 'primary' : this.defaultButtonVariant;
      },
      onClick(filter, option) {
        const selected = this.isSelected(filter, option.kind);
        this.onOptionClick({ filter, option: option.kind, checked: !selected });
      },
    },
  };
</script>
