<template>

  <b-modal
    id="manuq-modal"
    size="xl"
    centered
    title="Hola Mundo"
    :hideFooter="true"
    headerCloseVariant="light"
  >
    <p>Status: {{ statusLabel }}</p>
    <b-button @click="onImportStart">
      Start
    </b-button>
    <b-button @click="onImportCheck">
      Check
    </b-button>
  </b-modal>

</template>


<script>

  import client from 'kolibri.client';
  import urls from 'kolibri.urls';

  export default {
    name: 'ManuqModal',
    metaInfo() {},
    components: {},
    data() {
      return {
        statusLabel: 'idle',
      };
    },
    computed: {},
    watch: {},
    mounted() {},
    beforeDestroy() {},
    methods: {
      onImportStart() {
        this.statusLabel = 'starting...';
        client({
          url: urls['kolibri:kolibri_explore_plugin:endless_key_collections_new'](),
          method: 'POST',
          data: { method: 'importchannel' },
        }).then(({ data }) => {
          console.log(data);
          if (data.message) {
            this.statusLabel = data.message;
          }
        });
      },
      onImportCheck() {
        this.statusLabel = 'checking...';
        client({
          url: urls['kolibri:kolibri_explore_plugin:endless_key_collections_new'](),
          method: 'GET',
        }).then(({ data }) => {
          console.log(data);
          if (data.message) {
            this.statusLabel = data.message;
          }
        });
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../styles';

</style>
