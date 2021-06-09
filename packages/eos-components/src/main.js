import Card from './components/Card.vue';
import CardBody from './components/CardBody.vue';
import CardGrid from './components/CardGrid.vue';
import CardGridPlaceholder from './components/CardGridPlaceholder.vue';
import CarouselCard from './components/CarouselCard.vue';
import CarouselPlaceholder from './components/CarouselPlaceholder.vue';
import ChannelCard from './components/ChannelCard.vue';
import ChannelCardGroup from './components/ChannelCardGroup.vue';
import ChannelLogo from './components/ChannelLogo.vue';
import CollapsibleCardGrid from './components/CollapsibleCardGrid.vue';
import ContentLink from './components/ContentLink.vue';
import DummyButton from './components/DummyButton.vue';
import GridPage from './components/GridPage.vue';
import Header from './components/Header.vue';
import HighResCard from './components/HighResCard.vue';
import LowResCard from './components/LowResCard.vue';
import PaginatedCardGrid from './components/PaginatedCardGrid.vue';
import PlayButton from './components/PlayButton.vue';
import RegularCard from './components/RegularCard.vue';
import SearchBar from './components/SearchBar.vue';
import SlidableCardGrid from './components/SlidableCardGrid.vue';
import TopicCard from './components/TopicCard.vue';

import cardMixin from './components/mixins/cardMixin.js';

import utils from './components/utils.js';
import constants from './constants.js';

const components = {
  Card,
  CardBody,
  CardGrid,
  CardGridPlaceholder,
  CarouselCard,
  CarouselPlaceholder,
  ChannelCard,
  ChannelCardGroup,
  ChannelLogo,
  CollapsibleCardGrid,
  ContentLink,
  DummyButton,
  GridPage,
  Header,
  HighResCard,
  LowResCard,
  PaginatedCardGrid,
  PlayButton,
  RegularCard,
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
  utils,
  constants,
  plugin as default,
};
