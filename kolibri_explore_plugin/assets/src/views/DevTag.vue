<template>

  <div class="dev fixed-top mx-1 text-right">
    <span v-b-modal.buildinfo class="badge badge-warning">{{ title }}</span>

    <b-modal v-if="info" id="buildinfo" title="Build Info" okOnly>
      <b-list-group>
        <b-list-group-item>Commit: {{ info.commit }}</b-list-group-item>
        <b-list-group-item>Date: {{ info.date }}</b-list-group-item>
        <b-list-group-item>Last Release: {{ info.last_release }}</b-list-group-item>
      </b-list-group>
      <h3>Log</h3>
      <b-list-group>
        <b-list-group-item v-for="commit in info.log" :key="commit.commit">
          {{ commit.subject }} <br> <i>{{ commit.author }}</i>
        </b-list-group-item>
      </b-list-group>
    </b-modal>
  </div>

</template>


<script>

  import urls from 'kolibri.urls';

  export default {
    name: 'DevTag',
    data() {
      return {
        info: null,
      };
    },
    computed: {
      title() {
        if (this.info) {
          return this.info.commit;
        }

        return 'loading...';
      },
    },
    mounted() {
      this.getBuildInfo();
    },
    methods: {
      getBuildInfo() {
        const buildInfo = urls.static(`build-info.json`);
        fetch(buildInfo)
          .then(response => response.json())
          .then(data => {
            this.info = data;
          })
          .catch(error => {
            console.error(error);
          });
      },
    },
  };

</script>


<style lang="scss">

  @import '../styles';

  .dev {
    z-index: $zindex-tooltip !important;
  }

</style>
