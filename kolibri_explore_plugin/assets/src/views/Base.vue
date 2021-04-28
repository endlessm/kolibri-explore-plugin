<template>

  <div
    ref="mainWrapper"
    class="main-wrapper"
  >
    <SideNav
      :navShown="navShown"
      :headerHeight="headerHeight"
      :width="navWidth"
      @toggleSideNav="navShown = !navShown"
    />

    <div v-if="!loading" class="explore-main-content">
      <div class="explore-buttons">
        <KButton
          v-if="back"
          class="endless-icon"
          appearance="flat-button"
          @click="goBack()"
        >
          <svg
            id="svg898"
            xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:cc="http://creativecommons.org/ns#"
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns:svg="http://www.w3.org/2000/svg"
            xmlns="http://www.w3.org/2000/svg"
            width="67.255981"
            height="32.368767"
            viewBox="0 0 67.255981 32.368767"
            fill="none"
            version="1.1"
          >
            <metadata
              id="metadata904"
            >
              <rdf:RDF>
                <cc:Work
                  rdf:about=""
                >
                  <dc:format>image/svg+xml</dc:format>
                  <dc:type
                    rdf:resource="http://purl.org/dc/dcmitype/StillImage"
                  />
                  <dc:title />
                </cc:Work>
              </rdf:RDF>
            </metadata>
            <defs
              id="defs902"
            />
            <!-- eslint-disable max-len vue/max-len -->
            <path
              id="path896"
              d="m 56.933491,22.544382 c -2.83,0 -7.7407,-1.3742 -14.317,-3.9941 6.1037,-2.9199 10.9827,-4.4427 14.317,-4.4427 3.6023,0 4.3055,1.6028 4.3055,4.3713 0,3.4512 -1.1269,4.0655 -4.3055,4.0655 z m -46.6139,-4.2312 c -3.6023003,0 -4.3083003,-1.6028 -4.3083003,-4.3713 0,-3.4512 1.1297,-4.0654999 4.3083003,-4.0654999 2.83,0 7.7407,1.3741999 14.317,3.9940999 -6.1066,2.9199 -10.9855,4.4427 -14.317,4.4427 z m 46.6139,-7.5625 c -5.0317,0 -11.951,2.7741 -18.3775,6.0568 l -6.2277,-3.1341 c 5.0864,-2.8084 9.5245,-5.6682999 11.9654,-7.2938999 l 1.1153,-0.7429 c 0.4668,-0.3257 0.5533,-1.0085 0.1902,-1.5199 l -0.634,-0.8885 c -0.3631,-0.5086 -0.9914,-0.6943 -1.3977,-0.4114 l -0.2479,0.1571 c -1.9481,1.3171 -6.5763,4.3684 -11.9798,7.3938999 -0.9337,0.5229 -1.8472,1.02 -2.7406,1.4942 -8.4381,-3.5425999 -14.5879,-5.3396999 -18.2796,-5.3396999 -3.5821003,0 -7.6916003,0.8428 -7.6916003,7.4195999 0,3.5256 1.3343,7.7254 7.6916003,7.7254 5.0317,0 11.9511,-2.7742 18.3776,-6.0569 l 6.2276,3.1342 c -4.8098,2.657 -9.0346,5.354 -11.5418,7.0168 -1.3573,0.8999 -1.4495,0.9628 -1.4495,0.9628 -0.513,0.36 -0.6398,1.0685 -0.2767,1.5799 l 0.634,0.8885 c 0.3631,0.5086 1.0605,0.6457 1.5505,0.3029 0,0 0.0028,-0.0029 0.902,-0.5972 l 0.0029,0.0029 c 2.2564,-1.5028 6.4121,-4.1855 11.17,-6.8511 0.9337,-0.5228 1.8472,-1.0228 2.7406,-1.4942 8.4381,3.5484 14.5879,5.3455 18.2824,5.3455 3.5793,0 7.6888,-0.8429 7.6888,-7.4197 -0.0058,-3.5284 -1.3401,-7.731 -7.6945,-7.731 z"
              fill="#f15a22"
            />
          </svg>
        </KButton>
        <KIconButton
          v-else
          icon="menu"
          size="large"
          appearance="raised-button"
          @click="navShown = !navShown"
        />
      </div>
      <slot></slot>
    </div>
  </div>

</template>


<script>

  import { mapState } from 'vuex';
  import responsiveWindowMixin from 'kolibri.coreVue.mixins.responsiveWindowMixin';
  import KIconButton from 'kolibri-design-system/lib/buttons-and-links/KIconButton';
  import SideNav from 'kolibri.coreVue.components.SideNav';

  export default {
    name: 'Base',
    components: {
      SideNav,
      KIconButton,
    },
    mixins: [responsiveWindowMixin],
    props: {
      back: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        navShown: false,
      };
    },
    computed: {
      headerHeight() {
        return this.windowIsSmall ? 56 : 64;
      },
      navWidth() {
        return this.headerHeight * 4;
      },
      ...mapState({
        loading: state => state.core.loading,
      }),
    },
    methods: {
      goBack() {
        this.$router.push('/');
      },
    },
  };

</script>


<style lang="scss" scoped>

  .explore-main-content {
    position: relative;
  }

  .explore-buttons {
    position: absolute;
    top: 10px;
    left: 5px;

    /* Just below the sidenav */
    z-index: 14;
  }

  .endless-icon > svg {
    vertical-align: middle;
  }

</style>
