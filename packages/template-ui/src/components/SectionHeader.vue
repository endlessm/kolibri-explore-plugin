<template>
  <b-card
    noBody
    :style="style"
    class="bg-secondary header-card mt-4 text-light"
  >
    <b-container class="my-auto">
      <b-row>
        <b-col class="m-4">
          <b-card-title>{{ node.title }}</b-card-title>
          <b-card-text class="description">
            <VClamp
              ref="c"
              autoresize
              :maxLines="9"
              :expanded.sync="expanded"
            >
              {{ node.description }}
              <template v-slot:after="slotProps">
                <b-button
                  v-if="slotProps.clamped"
                  class="bg-transparent"
                  variant="dark"
                  @click="toggleExpanded"
                >
                  (more)
                </b-button>
              </template>
            </VClamp>
          </b-card-text>
        </b-col>
        <b-col />
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
import VClamp from 'vue-clamp';
import { getThumbnail } from 'kolibri-api';

export default {
  name: 'SectionHeader',
  components: {
    VClamp,
  },
  props: {
    node: Object,
  },
  data() {
    return {
      thumbnail: null,
      expanded: false,
    };
  },
  computed: {
    style() {
      return `background-image: linear-gradient(.25turn, rgba(0, 0, 0, .8), rgba(0, 0, 0, .8), rgba(0, 0, 0, .1)), url(${this.thumbnail}) !important;`;
    },
  },
  created() {
    this.getThumbnail();
  },
  methods: {
    async getThumbnail() {
      if (this.node.thumbnail) {
        this.thumbnail = this.node.thumbnail;
        return;
      }
      const thumbnail = await getThumbnail(this.node);
      this.thumbnail = thumbnail;
    },
    toggleExpanded() {
      this.expanded = !this.expanded;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.header-card {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-style: none;;
  text-shadow: 0 1px 0 black;
  font-weight: 400;
  min-height: 20rem;

}

button:hover {
  color: $primary !important;
}

</style>
