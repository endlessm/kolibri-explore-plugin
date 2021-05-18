<template>
  <div
    id="footer"
    class="bg-secondary mt-auto"
    :style="{ backgroundImage: footerImageURL }"
  >
    <b-container>
      <b-card class="bg-transparent border-0 text-center text-light">
        <h3>About {{ channel.title }}</h3>
        <p class="font-weight-bold">
          {{ channel.description }}
        </p>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'Footer',
  computed: {
    ...mapState(['channel']),
    ...mapGetters(['getAssetURL']),
    footerImageURL() {
      return this.getAssetURL('footerImage');
    },
  },
};
</script>

<style lang="scss">
#footer {
  text-shadow: 1px 1px 2px #333;
}
</style>
