<template>
  <div class="footer">
    <b-container>
      <div v-if="bundleCopyright || bundleLogo" class="mb-5 pb-4 w-50">
        <b-img v-if="bundleLogo" class="mb-2" :src="bundleLogo" />
        <p v-if="bundleCopyright">
          {{ bundleCopyright }}
        </p>
      </div>
      <h5 class="text-primary">
        Powered by a Ready to Learn Grant
      </h5>
      <div class="w-50">
        <b-img class="mb-2" :src="footerLogos" />
        <p>
          The contents of this flash drive were developed under a grant from the Department of
          Education. However, those contents do not necessarily represent the policy of the
          Department of Education, and you should not assume endorsement by the Federal
          Government. The project is funded by a Ready To Learn grant (PR/AWARD No.
          U295A150003, CFDA No. 84.295A) provided by the Department of Education to the
          Corporation for Public Broadcasting.
        </p>
      </div>
    </b-container>
  </div>
</template>

<script>
  import _ from 'lodash';
  import { utils } from 'ek-components';
  import footerLogos from '../assets/footer-logos.png';
  import elinorLogo from '../assets/elinor-wonders-why.png';
  import pegcatLogo from '../assets/peg-cat.png';
  import mollyLogo from '../assets/molly-of-denali.png';
  import readyjetgoLogo from '../assets/ready-jet-go.png';

  const copyrightsPerBundle = {
    'elinor-wonders-why': '©2021 Shoe Ink. All rights reserved PBS KIDS.',
    'peg-cat': '©2021 Feline Features, LLC. All Rights Reserved.',
    'molly-of-denali': 'Molly of Denali, ™/© 2021 WGBH Educational Foundation. All rights reserved.',
    'ready-jet-go': '©Copyright 2021 Jet Propulsion, LLC. Ready Jet Go! and A Kids Place Is Exploring Space are registered trademarks of Jet Propulsion, LLC.',
  }

  const logosPerBundle = {
    'elinor-wonders-why': elinorLogo,
    'peg-cat': pegcatLogo,
    'molly-of-denali': mollyLogo,
    'ready-jet-go': readyjetgoLogo,
  }

  export default {
    name: 'EkFooter',
    data() {
      return {
        footerLogos,
        section: {}
      };
    },
    computed: {
      slug() {
        if (!this.section.title) {
          return null;
        }
        return utils.getSlug(this.section.title);
      },
      bundleCopyright() {
        if (!this.slug) {
          return '';
        }
        return _.get(copyrightsPerBundle, this.slug, '');
      },
      bundleLogo() {
        if (!this.slug) {
          return null;
        }
        return _.get(logosPerBundle, this.slug, null);
      },
    },
    watch: {
      $route() {
        return this.fetchSection();
      },
    },
    mounted() {
      return this.fetchSection();
    },
    methods: {
      fetchSection() {
        const { topicId } = this.$route.params;
        if (!topicId) {
          return Promise.resolve({});
        }

        return window.kolibri.getContentById(topicId)
          .then((section) => {
            this.section = section;
          });
      },
    },
  };
</script>

<style lang="scss" scoped>

  @import '@/styles.scss';

  .w-50 {
    @include media-breakpoint-down(md) {
      width: 100% !important;
    }
  }

  .footer {
    padding: 5rem 0;
    box-shadow: inset $box-shadow-sm;
    background-color: $gray-400;
  }
</style>
