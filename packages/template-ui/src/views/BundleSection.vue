<template>
  <div>
    <b-jumbotron
      fluid
    >
      <template v-slot:default>
        <b-row class="mt-3">
          <b-col md="6" sm="12">
            <h3>{{ section.title }}</h3>
            <p class="mb-2">
              {{ subtitle }}
            </p>
            <!-- eslint-disable vue/no-v-html -->
            <div class="mb-2" v-html="section.description"></div>
            <b-badge
              v-for="tag in subjectTags"
              :key="tag"
              pill
              variant="primary"
              class="mb-1 mr-1"
            >
              {{ tag }}
            </b-badge>
          </b-col>
          <b-col md="6" sm="12">
            <div
              v-for="content in section.children"
              :key="content.id"
              class="mb-3"
            >
              <b-link
                @click="goToContent(content)"
              >
                <ContentImage :node="content" />
              </b-link>
            </div>
          </b-col>
        </b-row>
      </template>
    </b-jumbotron>
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

.jumbotron {
  background-color: $white;
  background-size: cover;
  padding-top: $navbar-height;
}

</style>
