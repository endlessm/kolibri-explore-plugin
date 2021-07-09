import ButtonsBar from './components/ButtonsBar.vue';
import Card from './components/Card.vue';
import CardBody from './components/CardBody.vue';
import CardGrid from './components/CardGrid.vue';
import CardGridPlaceholder from './components/CardGridPlaceholder.vue';
import Carousel from './components/Carousel.vue';
import CarouselCard from './components/CarouselCard.vue';
import CarouselPlaceholder from './components/CarouselPlaceholder.vue';
import ChannelCard from './components/ChannelCard.vue';
import ChannelCardGroup from './components/ChannelCardGroup.vue';
import ChannelLogo from './components/ChannelLogo.vue';
import CollapsibleCardGrid from './components/CollapsibleCardGrid.vue';
import ContentLink from './components/ContentLink.vue';
import DummyButton from './components/DummyButton.vue';
import Footer from './components/Footer.vue';
import GridPage from './components/GridPage.vue';
import Header from './components/Header.vue';
import PaginatedCardGrid from './components/PaginatedCardGrid.vue';
import PlayButton from './components/PlayButton.vue';
import ContentCard from './components/ContentCard.vue';
import SearchBar from './components/SearchBar.vue';
import SlidableCardGrid from './components/SlidableCardGrid.vue';
import TopicCard from './components/TopicCard.vue';

import cardMixin from './components/mixins/cardMixin.js';
import responsiveMixin from './components/mixins/responsiveMixin.js';

import utils from './utils.js';
import constants from './constants.js';

const components = {
  ButtonsBar,
  Card,
  CardBody,
  CardGrid,
  CardGridPlaceholder,
  Carousel,
  CarouselCard,
  CarouselPlaceholder,
  ChannelCard,
  ChannelCardGroup,
  ChannelLogo,
  CollapsibleCardGrid,
  ContentLink,
  DummyButton,
  Footer,
  GridPage,
  Header,
  PaginatedCardGrid,
  PlayButton,
  ContentCard,
  SearchBar,
  SlidableCardGrid,
  TopicCard,
};

const plugin = {
  install(Vue) {
    Object.keys(components).forEach((k) => {
      Vue.component(k, components[k]);
    });
  },
};

export {
  components,
  cardMixin,
  responsiveMixin,
  utils,
  constants,
  plugin as default,
};
