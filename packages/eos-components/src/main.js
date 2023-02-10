import BackToTop from './components/BackToTop.vue';
import ButtonsBar from './components/ButtonsBar.vue';
import Card from './components/Card.vue';
import CardBody from './components/CardBody.vue';
import CardGrid from './components/CardGrid.vue';
import CardGridPlaceholder from './components/CardGridPlaceholder.vue';
import Carousel from './components/Carousel.vue';
import CarouselCard from './components/CarouselCard.vue';
import CarouselCardTitle from './components/CarouselCardTitle.vue';
import CarouselPlaceholder from './components/CarouselPlaceholder.vue';
import ChannelCard from './components/ChannelCard.vue';
import ChannelCardGroup from './components/ChannelCardGroup.vue';
import ChannelLogo from './components/ChannelLogo.vue';
import CollapsibleCardGrid from './components/CollapsibleCardGrid.vue';
import ContentCard from './components/ContentCard.vue';
import ContentLink from './components/ContentLink.vue';
import DummyButton from './components/DummyButton.vue';
import Footer from './components/Footer.vue';
import GridPage from './components/GridPage.vue';
import Keywords from './components/Keywords.vue';
import NavBar from './components/NavBar.vue';
import PlayButton from './components/PlayButton.vue';
import PrivacyPolicyText from './components/PrivacyPolicyText.vue';
import SearchBar from './components/SearchBar.vue';
import SlidableCardGrid from './components/SlidableCardGrid.vue';
import SlidableGrid from './components/SlidableGrid.vue';
import TopicCard from './components/TopicCard.vue';
import WelcomeCard from './components/WelcomeCard.vue';
import PackCard from './components/PackCard.vue';

import cardMixin from './components/mixins/cardMixin.js';
import responsiveMixin from './components/mixins/responsiveMixin.js';

import utils from './utils.js';
import constants from './constants.js';

import EndlessLogo from './assets/EndlessLogo.svg';

const components = {
  BackToTop,
  ButtonsBar,
  Card,
  CardBody,
  CardGrid,
  CardGridPlaceholder,
  Carousel,
  CarouselCard,
  CarouselCardTitle,
  CarouselPlaceholder,
  ChannelCard,
  ChannelCardGroup,
  ChannelLogo,
  CollapsibleCardGrid,
  ContentCard,
  ContentLink,
  DummyButton,
  Footer,
  GridPage,
  Keywords,
  NavBar,
  PackCard,
  PlayButton,
  PrivacyPolicyText,
  SearchBar,
  SlidableCardGrid,
  SlidableGrid,
  TopicCard,
  WelcomeCard,
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
