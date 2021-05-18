<template>
<div id="home" class="bg-secondary pt-3">

<b-container>
    <transition-group
      name="thumbs"
      tag="b-row"
      class="mb-5"
      :css="false"
      appear
      @appear="appear"
      @enter="enter"
      foo-before-enter=""
      foo-after-enter=""
      @leave="leave"
    >
    <b-col
      cols="6"
      md="4"
      class="mb-4"
      v-for="(node, index) in currentSection.children"
      :key="node.id"
      :data-index="index"
    >
  <b-link
    v-on:click="goToContent(node)"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <Card
      :node="node"
    />
  </b-link>
    </b-col>
    </transition-group>
</b-container>

</div>
</template>

<script>
import {
  gsap, Back, Elastic, Power2,
} from 'gsap';
import { goToContent } from 'kolibri-api';
import Card from '@/components/Card.vue';
import swooshSound from '@/components/swoosh.wav';
import popSound from '@/components/pop.flac';

export default {
  components: {
    Card,
  },
  data() {
    return {
      sounds: {
        swoosh: new Audio(swooshSound),
        pop: new Audio(popSound),
      },
    };
  },
  computed: {
    currentSection() {
      return this.$root.$children[0].currentSection;
    },
  },
  methods: {
    appear(el, done) {
      const t = gsap.timeline({ delay: 1 });
      const delay = 0.05 * el.dataset.index;
      t.fromTo(el, 0.8, {
        x: -500,
        rotation: 30,
        scale: 1,
        opacity: 0,
      }, {
        x: 0,
        rotation: 0,
        opacity: 1,
        ease: Power2.easeOut,
      }, delay);
      t.call(() => this.sounds.swoosh.play(), null, '-=0.8');
      t.call(done);
    },
    enter(el, done) {
      // biggest leave = 0.5 + 0.05 * 8
      const t = gsap.timeline({ delay: 0.9 });
      const delay = Math.random() * 0.5;
      t.fromTo(el, 0.5, {
        x: 0,
        rotation: -30,
        scale: 0,
        opacity: 0,
      }, {
        x: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
        ease: Back.easeInOut,
      }, delay);
      t.call(() => this.sounds.pop.play(), null, '-=0.2');
      t.call(done);
    },
    leave(el, done) {
      const t = gsap.timeline();
      const delay = 0.05 * el.dataset.index;
      t.fromTo(el, 0.5, {
        x: 0,
        rotation: 0,
        scale: 1,
        opacity: 1,
      }, {
        x: 500,
        rotation: -30,
        scale: 1,
        opacity: 0,
        ease: Power2.easeIn,
      }, delay);
      t.call(() => this.sounds.swoosh.play(), null, '-=0.5');
      t.call(done, {}, 0.5 + 0.05 * (this.currentSection.children.length - 1));
    },
    hover(isHovered, el) {
      if (isHovered) {
        this.sounds.pop.play();
      }
      gsap.fromTo(el, 0.8, {
        scale: isHovered ? 1 : 1.1,
      }, {
        scale: isHovered ? 1.1 : 1,
        ease: Elastic.easeOut.config(1, 0.3),
      });
    },
    onMouseEnter(event) {
      this.hover(true, event.target.firstChild);
    },
    onMouseLeave(event) {
      this.hover(false, event.target.firstChild);
    },
    goToContent,
  },
};
</script>

<style lang="scss" scoped>
@import '@/styles.scss';
#home {
  height: 100%;
}
</style>
