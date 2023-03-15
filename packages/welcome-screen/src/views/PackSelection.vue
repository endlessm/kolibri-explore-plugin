<template>
  <WelcomeBase title="Which option sounds most like you?">
    <template #body>

      <b-container class="no-container-padding text-left">
        <SlidableGrid
          v-slot="slotProps"
          class="mb-3"
          :nodes="PackMetadata"
          :hasWhiteBackground="true"
          :itemsPerSlide="{ lg: 3, md: 2, sm: 1 }"
        >
          <template
            v-for="pack in slotProps.slideNodes"
          >
            <PackCard
              :key="pack.id"
              :packId="pack.id"
              :title="pack.title"
              :subTitle="pack.subtitle"
              @click="choosePack(pack.id)"
            />
          </template>
        </SlidableGrid>
      </b-container>
    </template>
  </WelcomeBase>
</template>


<script>
  import { PackMetadata } from 'eos-components/src/constants';
  import WelcomeBase from './WelcomeBase.vue';

  export default {
    name: 'PackSelection',
    components: {
      WelcomeBase,
    },
    data() {
      return {
        PackMetadata,
      };
    },
    methods: {
      choosePack(packId) {
        this.$store.commit('setPackSelected', packId);
        this.$router.push('/pack-ready');
      },
    },
  };
</script>
