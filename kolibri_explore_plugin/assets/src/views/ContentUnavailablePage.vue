<template>

  <b-container>
    <h1>{{ $tr('header') }}</h1>
    <p>
      <b-link v-if="deviceContentUrl" :href="deviceContentUrl">
        {{ $tr('adminLink') }}
      </b-link>
    </p>
    <p>{{ $tr('learnerText') }}</p>
  </b-container>

</template>


<script>

  import { mapGetters } from 'vuex';
  import urls from 'kolibri.urls';

  export default {
    name: 'ContentUnavailablePage',
    metaInfo() {
      return {
        title: this.$tr('documentTitle'),
      };
    },
    computed: {
      ...mapGetters(['canManageContent']),
      deviceContentUrl() {
        const deviceContentUrl = urls['kolibri:kolibri.plugins.device:device_management'];
        if (deviceContentUrl && this.canManageContent) {
          return `${deviceContentUrl()}#/content`;
        }

        return '';
      },
    },
    $trs: {
      header: 'No resources available',
      adminLink: 'As an administrator you can import channels',
      learnerText: 'Please ask your coach or administrator for assistance',
      documentTitle: {
        message: 'Content Unavailable',
        context: '\nThis string should actually say "Resource unavailable"',
      },
    },
  };

</script>
