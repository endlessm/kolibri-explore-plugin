<template>
  <transition
    class="d-none d-md-block d-xl-none"
    :css="false"
    appear
    @enter="enter"
    @leave="leave"
  >
      <img ref="el" :src="logo" v-b-hover="hover" @click="click"/>
  </transition>
</template>

<script>
import { gsap, Back } from 'gsap';
import logo from '@/pbs-kids-logo.svg';
import swooshSound from '@/components/swoosh.wav';
import popSound from '@/components/pop.flac';
import pbskidsSound from '@/sounds/pbsKids.mp3';

export default {
  data() {
    return {
      logo,
      sounds: {
        swoosh: new Audio(swooshSound),
        pop: new Audio(popSound),
        pop2: new Audio(popSound),
        pbskids: new Audio(pbskidsSound),
      },
    };
  },
  methods: {
    enter(el, done) {
      const t = gsap.timeline({ delay: 3 });
      t.call(() => this.sounds.swoosh.play(), null, '+=0');
      t.from(el, 1, {
        x: -200,
        rotation: -360,
        ease: Back.easeInOut,
      });
      t.call(done);
    },
    leave(el, done) {
      const t = gsap.timeline();
      t.call(() => this.sounds.swoosh.play(), null, '+=0');
      t.to(el, 1, {
        x: -200,
        rotation: -360,
        ease: Back.easeInOut,
      });
      t.call(done);
    },
    hover(isHovered) {
      const { el } = this.$refs;
      if (isHovered) {
        this.sounds.pbskids.play();
      }
      gsap.to(el, 0.5, {
        rotation: isHovered ? -45 : 0,
        ease: Back.easeInOut,
      });
    },
    click() {
      const t = gsap.timeline();
      const { el } = this.$refs;
      t.call(() => this.sounds.swoosh.play(), null, '+=0');
      t.fromTo(el, 0.8, {
        scale: 1,
      }, {
        scale: 0.5,
        ease: 'back.out',
      });
      t.to(el, 1, {
        y: 86,
        ease: 'bounce.out',
      }, '-=0');
      t.call(() => this.sounds.pop.play(), null, '-=0.7');
      t.call(() => this.sounds.pop2.play(), null, '-=0.3');
      t.to(el, 1, {
        x: -200,
        rotation: -360,
        ease: 'back.inOut',
      });
      t.call(() => this.sounds.swoosh.play(), null, '-=0.8');
      t.to(el, 0, {
        y: 0,
        scale: 1,
      });
      t.call(() => this.sounds.swoosh.play(), null, '+=0');
      t.to(el, 1, {
        x: 0,
        rotation: 0,
        ease: 'back.inOut',
      });
    },
  },
};
</script>
