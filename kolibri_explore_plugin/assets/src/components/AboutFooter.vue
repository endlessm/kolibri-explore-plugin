<template>

  <b-container class="mb-5">

    <b-row class="d-flex justify-content-center" cols="3">

      <b-col class="col-auto d-flex justify-content-center">
        <button
          v-b-modal.about-modal
          class="btn d-md-block d-none shadow-none"
        >
          {{ $tr('aboutLabel') }}
        </button>
      </b-col>

      <b-col class="col-auto d-flex justify-content-center">
        <button
          v-b-modal.about-modal
          class="btn d-md-block d-none shadow-none"
          @click="$root.$emit('setAboutSection', 'privacy-policy-link')"
        >
          {{ $tr('privacyPolicyLabel') }}
        </button>
      </b-col>

    </b-row>

  </b-container>

</template>


<script>

  export default {
    name: 'AboutFooter',
    $trs: {
      aboutLabel: 'About Endless Key',
      privacyPolicyLabel: 'Privacy Policy',
    },
  };

</script>
