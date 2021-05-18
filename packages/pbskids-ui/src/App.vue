<template>
  <div id="app">
  <div id="header">
    <Background id="background"/>
    <img id="navLeft" :src="navLeft"/>
    <img id="navRight" :src="navRight"/>
    <Logo id="logo"/>
  </div>
<b-container id="navbar" class="d-flex align-items-center justify-content-center">
  <b-button
    v-for="section in mainSections"
    :key="'button-' + section.id"
    :data-slug="sectionSlug(section.title)"
    @mouseenter="playButtonSound(sectionSlug(section.title))"
    @click="currentSection = section"
    :variant="currentSection === section ? 'primary' : 'secondary'"
  >
    {{ section.title.split(" ")[0] }}
    <br/>
    {{ section.title.split(" ")[1] }}
  </b-button>
</b-container>
    <router-view/>
  </div>
</template>

<script>
import arrayToTree from 'array-to-tree';
import getSlug from '@/utils';
import { askChannelInformation } from 'kolibri-api';
import Background from '@/components/Background.vue';
import Logo from '@/components/Logo.vue';
import navLeft from '@/nav-line-bkgrnd_left.svg';
import navRight from '@/nav-line-bkgrnd_right.svg';
import newSound from '@/sounds/newGames.mp3';
import popularSound from '@/sounds/popularGames.mp3';
import hardSound from '@/sounds/hardGames.mp3';
import allSound from '@/sounds/allGames.mp3';

let mockData;
if (process.env.VUE_APP_USE_MOCK_DATA === 'true') {
  const mockDataFilename = 'nodes';
  // eslint-disable-next-line global-require, import/no-dynamic-require
  mockData = require(`@/${mockDataFilename}.json`);
}

export default {
  name: 'App',
  components: {
    Background,
    Logo,
  },
  data() {
    return {
      channel: {},
      nodes: [],
      currentSection: null,
      navLeft,
      navRight,
      sounds: {
        'new-games': new Audio(newSound),
        'popular-games': new Audio(popularSound),
        'hard-games': new Audio(hardSound),
        'all-games': new Audio(allSound),
      },
    };
  },
  computed: {
    contentNodes() {
      return this.nodes.filter((n) => n.kind !== 'topic');
    },
    nodesTree() {
      return arrayToTree(this.nodes, { parentProperty: 'parent' });
    },
    mainSections() {
      if (this.nodesTree && this.nodesTree[0]) {
        return this.nodesTree[0].children;
      }
      return [];
    },
  },
  methods: {
    gotChannelInformation(data) {
      // console.log(JSON.stringify(data));
      if (data.channel) {
        this.channel = data.channel;
      }
      if (data.nodes) {
        this.nodes = data.nodes;
      }
      [this.currentSection] = this.mainSections;
    },
    sectionSlug(title) {
      return getSlug(title);
    },
    playButtonSound(slug) {
      this.sounds[slug].play();
    },
  },
  created() {
    if (process.env.VUE_APP_USE_MOCK_DATA === 'true') {
      this.gotChannelInformation(mockData);
    } else {
      askChannelInformation(this.gotChannelInformation);
    }
  },
};
</script>

<style lang="scss">
@import './styles.scss';

@font-face {
  font-family: "PBS_KIDS_Headline";
  src: url("./pbskidsheadline-regular-webfont.woff") format("woff");
}

.btn {
  font-family: PBS_KIDS_Headline, Arial, Helvetica, sans-serif !important;
  text-transform: uppercase !important;
  font-size: 2rem !important;
  transition: all ease .2s !important;
  position: relative !important;
  line-height: 1 !important;
  top: 0;
  &.btn-primary {
    box-shadow: 0 15px 0 0 darken($primary, 20%) !important;
    &:focus, &:active {
      box-shadow: 0 15px 0 0 darken($primary, 20%) !important;
    }
    &:hover {
      top: 10px;
      background-color: darken($primary, 2%);
      box-shadow: 0 5px 0 0 darken($primary, 20%) !important;
    }
  }
  &.btn-secondary {
    box-shadow: 0 15px 0 0 darken($secondary, 20%) !important;
    &:focus, &:active {
      box-shadow: 0 15px 0 0 darken($secondary, 20%) !important;
    }
    &:hover {
      top: 10px;
      background-color: darken($secondary, 2%);
      box-shadow: 0 5px 0 0 darken($secondary, 20%) !important;
    }
  }
}

@media (max-width: map-get($grid-breakpoints, md)) {
  /* Target devices narrower than 768px. */
  #navbar .btn {
    font-size: 1.5rem !important;
  }
}

@media (max-width: map-get($grid-breakpoints, lg)) {
  /* Target devices narrower than 768px. */
  #logo {
    opacity: 0;
  }
}

$margin: 50px;

html, body, #app {
  height: 100%;
}

#header {
  position: relative;
}

#navbar {
  height: 145px + $margin * 2;
  .btn {
    margin: 5px;
  }
}

#background {
  position: absolute;
  top: 0;
  left: 0;
}

#navLeft, #navRight {
  position: absolute;
  bottom: - 145px - $margin * 2;
}

#navRight {
  right: 0;
}

#logo {
  position: absolute;
  top: $margin;
  left: $margin;
}
</style>
