<template>

  <WelcomeBase :title="$tr('packSelectionTitle')">
    <template #body>

      <b-container class="no-container-padding text-left">
        <EkSlidableGrid
          v-slot="slotProps"
          class="mb-3"
          :nodes="PackMetadata"
          :hasWhiteBackground="true"
          :itemsPerSlide="{ lg: 3, md: 2, sm: 1 }"
        >
          <template
            v-for="pack in slotProps.slideNodes"
          >
            <EkPackCard
              :key="pack.id"
              :packId="pack.id"
              :title="packMetadataTitle(pack)"
              :subTitle="packMetadataSubtitle(pack)"
              @click="choosePack(pack.id)"
            />
          </template>
        </EkSlidableGrid>
      </b-container>
    </template>
  </WelcomeBase>

</template>


<script>

  import {
    PackMetadata,
    packMetadataTitle,
    packMetadataSubtitle,
  } from 'ek-components/src/constants';
  import { PageNames } from '../../constants';
  import WelcomeBase from './WelcomeBase';

  export default {
    name: 'PackSelectionPage',
    components: {
      WelcomeBase,
    },
    data() {
      return {
        PackMetadata,
      };
    },
    methods: {
      packMetadataTitle,
      packMetadataSubtitle,
      choosePack(name) {
        // FIXME: This is hardcoded to the (currently) only option.
        const sequence = '0001';
        this.$router.push({ name: PageNames.WELCOME_PACK_READY, params: { name, sequence } });
      },
    },
    $trs: {
      packSelectionTitle: {
        message: 'Which option sounds most like you?',
        context:
          'Title heading for when the user is asked to choose an initial content pack to download',
      },
    },
  };

</script>
