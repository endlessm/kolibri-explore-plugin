import EkBackToTop from './components/EkBackToTop.vue';
import EkButtonsBar from './components/EkButtonsBar.vue';
import EkCard from './components/EkCard.vue';
import EkCardBody from './components/EkCardBody.vue';
import EkCardButtons from './components/EkCardButtons.vue';
import EkCardGrid from './components/EkCardGrid.vue';
import EkCardGridPlaceholder from './components/EkCardGridPlaceholder.vue';
import EkCarousel from './components/EkCarousel.vue';
import EkCarouselCard from './components/EkCarouselCard.vue';
import EkCarouselCardTitle from './components/EkCarouselCardTitle.vue';
import EkCarouselPlaceholder from './components/EkCarouselPlaceholder.vue';
import EkChannelCard from './components/EkChannelCard.vue';
import EkChannelCardGroup from './components/EkChannelCardGroup.vue';
import EkChannelLogo from './components/EkChannelLogo.vue';
import EkCollapsibleCardGrid from './components/EkCollapsibleCardGrid.vue';
import EkContentCard from './components/EkContentCard.vue';
import EkContentLink from './components/EkContentLink.vue';
import EkFooter from './components/EkFooter.vue';
import EkGridPage from './components/EkGridPage.vue';
import EkKeywords from './components/EkKeywords.vue';
import EkNavBar from './components/EkNavBar.vue';
import EkPlayButton from './components/EkPlayButton.vue';
import EkPrivacyPolicyText from './components/EkPrivacyPolicyText.vue';
import EkSearchBar from './components/EkSearchBar.vue';
import EkSlidableCardGrid from './components/EkSlidableCardGrid.vue';
import EkSlidableGrid from './components/EkSlidableGrid.vue';
import EkTopicCard from './components/EkTopicCard.vue';
import EkPackCard from './components/EkPackCard.vue';
import EkClamp from './components/EkClamp.vue';

import cardMixin from './components/mixins/cardMixin.js';
import responsiveMixin from './components/mixins/responsiveMixin.js';

import utils from './utils.js';
import constants from './constants.js';

import EndlessLogo from './assets/EndlessLogo.svg';

const components = {
  EkBackToTop,
  EkButtonsBar,
  EkCard,
  EkCardBody,
  EkCardButtons,
  EkCardGrid,
  EkCardGridPlaceholder,
  EkCarousel,
  EkCarouselCard,
  EkCarouselCardTitle,
  EkCarouselPlaceholder,
  EkChannelCard,
  EkChannelCardGroup,
  EkChannelLogo,
  EkCollapsibleCardGrid,
  EkContentCard,
  EkContentLink,
  EkFooter,
  EkGridPage,
  EkKeywords,
  EkNavBar,
  EkPackCard,
  EkPlayButton,
  EkPrivacyPolicyText,
  EkSearchBar,
  EkSlidableCardGrid,
  EkSlidableGrid,
  EkTopicCard,
  EkClamp,
};

const plugin = {
  install(Vue) {
    Object.keys(components).forEach((k) => {
      Vue.component(k, components[k]);
    });
  },
};

const assets = {
  EndlessLogo,
};

export {
  components,
  cardMixin,
  responsiveMixin,
  utils,
  constants,
  assets,
  plugin as default,
};
