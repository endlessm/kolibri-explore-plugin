<template>
  <div>
    <b-container class="main-container">
      <b-row class="mt-3">
        <b-col md="4" sm="12">
          <h3>{{ section.title }}</h3>
          <p class="mb-2">
            {{ subtitle }}
          </p>
          <!-- eslint-disable vue/no-v-html -->
          <div class="description mb-2" v-html="section.description"></div>
        </b-col>
        <b-col
          md="8"
          sm="12"
        >
          <b-row>
            <b-col
              v-for="content in section.children"
              :key="content.id"
              class="content-col"
              md="6"
              sm="12"
            >
              <b-link
                @click="goToContent(content)"
              >
                <ContentImage :node="content" />
              </b-link>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
    <CardGrid
      v-if="nextNodesInTopic.length"
      :nodes="nextNodesInTopic"
      :cardColumns="cardColumns"
    >
      <b-row>
        <h3>Next in {{ section.title }}:</h3>
      </b-row>
    </CardGrid>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { goToContent } from 'kolibri-api';
import { utils } from 'eos-components';

export default {
  name: 'BundleSection',
  computed: {
    ...mapState(['section', 'cardColumns', 'channel']),
    ...mapGetters(['nextNodesInTopic']),
    subtitle() {
      return utils.getCardSubtitle(this.section, this.channel.title);
    },
  },
  methods: {
    goToContent,
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';

.main-container {
  background-color: $white;
  background-size: cover;
  padding-top: $navbar-height;
}

.content-col {
  margin-bottom: $grid-gutter-width;
}

</style>
