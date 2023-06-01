<template>
  <div class="card-content">
    <v-container>

      <!-- Channel -->
      <v-row v-if="showChannelIcon">
        <v-col>
          <!-- FIXME only for debugging: -->
          <span class="debug-node-id sr-only">{{ node.id }}</span>
          <div class="align-items-center d-flex mb-3">
            <EkChannelLogo class="mr-2" :channel="node.channel" size="sm" />
            <span class="channel-title text-muted text-truncate">{{ node.channel.title }}</span>
          </div>
        </v-col>
      </v-row>

      <!-- Title -->
      <v-row>
        <v-col>
          <h5 class="align-items-center mb-1 title">
            <VClamp
              autoresize
              :maxLines="titleLines"
            >
              {{ node.title }}
            </VClamp>
          </h5>
        </v-col>
      </v-row>

      <!-- Description -->
      <v-row v-if="!showChannelIcon">
        <v-col>
          <p class="mb-1 subtitle text-muted">
            <VClamp
              autoresize
              :maxLines="3"
            >
              {{ subtitle }}
            </VClamp>
          </p>
        </v-col>
      </v-row>

    </v-container>

  </div>
</template>

<script>
import VClamp from 'vue-clamp';

export default {
  name: 'EkCardBody',
  components: {
    VClamp,
  },
  props: {
    node: {
      type: Object,
      required: true,
    },
    titleLines: {
      type: Number,
      default: 3,
    },
    subtitle: {
      type: String,
      default: '',
    },
  },
  computed: {
    showChannelIcon() {
      return this.node.channel;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../styles.scss';

.card-content {
  // FIXME this is aproximate, the function has regressed:
  height: card-body-height(2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.channel-title {
  font-family: $btn-font-family;
  font-size: $btn-font-size;
  font-weight: $btn-font-weight;
}

.subtitle {
  flex-grow: 3;
  line-height: 1.1;
}
</style>
