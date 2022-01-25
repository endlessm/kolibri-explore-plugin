<template>
  <b-navbar-nav
    class="mt-3"
    aria-label="breadcrumb"
  >
    <b-link
      class="d-none d-sm-block mt-2"
      to="/"
    >
      <ChannelLogo :channel="channel" size="sm" />
    </b-link>
    <ol
      class="bg-transparent breadcrumb flex-nowrap px-2"
    >
      <li
        v-b-tooltip.hover
        :title="channel.name"
        class="breadcrumb-item text-light text-truncate"
      >
        <b-link to="/">
          {{ channel.name }}
        </b-link>
      </li>
    </ol>
  </b-navbar-nav>
</template>

<script>
import { responsiveMixin } from 'eos-components';
import { mapState } from 'vuex';


export default {
  name: 'Breadcrumb',
  mixins: [responsiveMixin],
  computed: {
    ...mapState(['channel']),
  },
};
</script>
