<template>
  <div>
    <DetailView>
      <b-row class="mt-3">
        <b-col md="5" sm="12">
          <h3>{{ section.title }}</h3>
          <p class="mb-2">
            {{ subtitle }}
          </p>
          <!-- eslint-disable vue/no-v-html -->
          <div class="description mb-2" v-html="section.description"></div>
        </b-col>
        <b-col
          md="7"
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
                <p class="h6 mt-2 text-dark">
                  {{ content.title }}
                </p>
              </b-link>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </DetailView>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { goToContent } from 'kolibri-api';
import { utils } from 'eos-components';

export default {
  name: 'BundleSection',
  computed: {
    ...mapState(['section', 'channel']),
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

.content-col {
  margin-bottom: $grid-gutter-width;
}

</style>
