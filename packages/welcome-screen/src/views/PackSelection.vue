<template>
  <WelcomeBase title="Which option sounds most like you?">
    <template #body>
      <b-container class="no-container-padding text-left">
        <b-row>
          <b-col v-for="pack in PackMetadata" :key="pack.id" md="4" sm="12">
            <PackCard
              class="mb-3"
              :packId="pack.id"
              :title="pack.title"
              :subTitle="pack.subtitle"
              :selected="selectedPack === pack.id"
              @click="selectPack(pack.id)"
              @choosePack="choosePack(pack.id)"
            />
          </b-col>
        </b-row>
      </b-container>
      <p class="mb-5">
        <UsbIcon />
        <SdIcon />
        If you have an Endless Key USB device or SD card,
        <b-link to="endless-key">
          press here to get your pack!
        </b-link>
      </p>
    </template>
  </WelcomeBase>
</template>


<script>
  import { PackMetadata } from 'eos-components/src/constants';
  import UsbIcon from 'vue-material-design-icons/Usb.vue';
  import SdIcon from 'vue-material-design-icons/Sd.vue';
  import WelcomeBase from './WelcomeBase.vue';

  export default {
    name: 'PackSelection',
    components: {
      UsbIcon,
      SdIcon,
      WelcomeBase,
    },
    data() {
      return {
        selectedPack: null,
        PackMetadata,
      };
    },
    methods: {
      selectPack(packId) {
        this.selectedPack = packId;
      },
      choosePack(packId) {
        this.$store.commit('setPackSelected', packId);
        this.$router.push('/pack-ready');
      },
    },
  };
</script>
