<template>
  <b-breadcrumb>
    <b-breadcrumb-item
      v-if="items.length > max"
      @click="$emit('click', home)"
    >
      {{ home.title }}
    </b-breadcrumb-item>
    <b-breadcrumb-item
      v-if="items.length > max + 1"
      @click="$emit('click', hiddenItem)"
    >
      ...
    </b-breadcrumb-item>
    <b-breadcrumb-item
      v-for="item in lastItems"
      :key="item.href"
      :active="item.href === lastItem.href"
      @click="$emit('click', item)"
    >
      {{ item.title }}
    </b-breadcrumb-item>
  </b-breadcrumb>
</template>

<script>
export default {
  name: 'WikiBreadcrumb',
  props: {
    items: {
      type: Array,
      required: true,
    },
    max: {
      type: Number,
      default: 4,
    },
  },
  computed: {
    home() {
      return this.items[0];
    },
    hiddenItem() {
      const index = this.max + 1;
      const [item] = this.items.slice(-index);
      return item;
    },
    lastItems() {
      return this.items.slice(-this.max);
    },
    lastItem() {
      const [item] = this.items.slice(-1);
      return item;
    },
  },
};
</script>

<style lang="scss" scoped>

.breadcrumb {
  margin: 0;
  background: transparent;
}

</style>
