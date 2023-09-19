<template>

  <div
    class="d-flex main-container min-vh-100 text-center"
  >
    <div class="d-flex flex-column flex-grow-1 w-100">
      <div class="flex-grow-1 welcome-background-top"></div>
      <div class="content p-3 pb-5 position-relative">
        <h1>{{ $tr('welcomeTitle') }}</h1>
        <div class="mb-4 mt-4">
          <b-button
            pill
            variant="primary"
            :to="{ name: PageNames.WELCOME_PACK_SELECTION }"
          >
            {{ $tr('getStartedButton') }}
          </b-button>
        </div>
        <p>
          <b-link v-b-modal.privacy-policy-modal>
            {{ $tr('privacyPolicy') }}
          </b-link>
        </p>
      </div>
      <div class="flex-grow-1 welcome-background-bottom"></div>
      <b-modal
        id="privacy-policy-modal"
        headerCloseVariant="light"
        size="xl"
        centered
      >
        <div class="bg-white modal-wrapper text-dark">
          <h3 class="pt-3 text-primary">
            {{ $tr('privacyPolicy') }}
          </h3>
          <EkPrivacyPolicyText class="pb-3" />
        </div>
      </b-modal>
    </div>
  </div>

</template>


<script>

  import EkPrivacyPolicyText from 'ek-components/src/components/EkPrivacyPolicyText.vue';
  import { PageNames } from '../../constants';

  export default {
    name: 'WelcomePage',
    components: { EkPrivacyPolicyText },
    data() {
      return {
        PageNames,
      };
    },
    $trs: {
      welcomeTitle: {
        message: 'Welcome to Endless Key!',
        context: 'Title heading for the welcome page',
      },
      getStartedButton: {
        message: 'Get Started',
        context: 'Button label on the welcome page',
      },
      privacyPolicy: {
        message: 'Privacy Policy',
        context: 'Footer link',
      },
    },
  };

</script>


<style lang="scss" scoped>

  @import '../../styles';

  .main-container {
    background-color: white;
  }

  .welcome-background-bottom,
  .welcome-background-top {
    background-repeat: no-repeat;
    background-size: contain;
  }

  .welcome-background-top {
    background-image: url('assets/welcome-bg-top-right.png');
    background-position: top right;
  }

  .welcome-background-bottom {
    background-image: url('assets/welcome-bg-bottom-left.png');
    background-position: bottom left;
  }

  .modal-wrapper {
    padding-right: $spacer;
    padding-left: $spacer;
    @include media-breakpoint-up(md) {
      padding-right: $grid-gutter-width + $circled-button-size;
      padding-left: $grid-gutter-width + $circled-button-size;
    }
  }

  ::v-deep .modal-body {
    padding-top: 0;
  }

  ::v-deep .modal-footer {
    display: none;
  }

</style>
