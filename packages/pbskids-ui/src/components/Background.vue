<template>
  <canvas id="background" ref="view"/>
</template>

<script>
import * as PIXI from '@/pixi';
import { gsap } from 'gsap';

import textureImage from '@/components/sprites/textures.png';
import textureInfo from '@/components/sprites/textures.json';
import displacementImage from '@/components/sprites/displacement.png';

export default {
  name: 'Background',
  components: {
  },
  data() {
    return {
      app: null,
      sheet: null,
      sprites: [
        'asteroid-one.png',
        'asteroid-two.png',
        'asteroid-three.png',
        'planet-1.png',
        'planet-2.png',
        'planet-3.png',
      ],
    };
  },
  computed: {
  },
  methods: {
    addSprite(x, y, seek = 0) {
      const name = this.sprites[Math.floor(Math.random() * this.sprites.length)];
      const s = new PIXI.Sprite(this.sheet.textures[name]);
      s.anchor.set(0.5, 0.5);
      s.x = x;
      s.y = y;
      const scale = 0.4 + Math.random();
      const dx = Math.random() < 0.5 ? -200 : 200;
      this.app.stage.addChild(s);
      const t = gsap.timeline();
      t.fromTo(s, 3, {
        pixi: {
          scaleX: 0,
          scaleY: 0,
          alpha: 0,
          rotation: Math.floor(Math.random() * 360),
        },
        ease: 'back.inOut',
      }, {
        pixi: {
          scaleX: scale,
          scaleY: scale,
          alpha: 1,
        },
        ease: 'back.inOut',
      });
      t.to(s, 6, {
        pixi: {
          x: s.x + dx,
        },
        repeat: 3,
        yoyo: true,
        ease: 'back.inOut',
      });
      t.to(s, 3, {
        pixi: {
          scaleX: 0,
          scaleY: 0,
          alpha: 0,
        },
        ease: 'back.inOut',
      });
      t.call(() => {
        this.app.stage.removeChild(s);
      });
      if (seek !== 0) {
        t.seek(seek);
      }
      t.timeScale(0.2);
    },
    onSheetParsed() {
      for (let i = 0; i <= 25; i += 1) {
        const seek = Math.random() * 10;
        this.spawn(seek);
      }
      gsap.to({}, 5, { repeat: -1, onRepeat: this.spawn });
    },
    spawn(seek = 0) {
      if (this.app.stage.children.length >= 15) {
        return;
      }
      const x = Math.random() * this.app.screen.width;
      const y = Math.random() * this.app.screen.height;
      this.addSprite(x, y, seek);
    },
    setup(loader, resources) {
      this.sheet = new PIXI.Spritesheet(resources.image.texture, textureInfo);
      const s = new PIXI.Sprite(resources.displacement.texture);
      s.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
      const filter = new PIXI.filters.DisplacementFilter(s);
      this.app.stage.addChild(s);
      this.app.stage.filters = [filter];
      gsap.ticker.add(() => {
        s.x += 0.1;
        s.y += 3;
        this.app.ticker.update();
      });
      this.sheet.parse(this.onSheetParsed);
    },
  },
  mounted() {
    const { view } = this.$refs;
    this.app = new PIXI.Application({
      transparent: true,
      view,
    });
    this.app.ticker.stop();
    this.app.loader
      .add('image', textureImage)
      .add('displacement', displacementImage)
      .load(this.setup);
    this.app.renderer.resize(window.innerWidth, 245);
    window.addEventListener('resize', () => {
      this.app.renderer.resize(window.innerWidth, 245);
    });
  },
};
</script>

<style lang="scss" scoped>

$margin: 50px;

#background {
  width: 100%;
  height: 145px + $margin * 2;
}

</style>
