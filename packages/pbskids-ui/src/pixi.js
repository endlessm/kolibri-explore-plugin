import { Application } from '@pixi/app';
import { TickerPlugin } from '@pixi/ticker';
import { AppLoaderPlugin } from '@pixi/loaders';
import { Spritesheet } from '@pixi/spritesheet';
import { Sprite } from '@pixi/sprite';
import { Renderer, BatchRenderer } from '@pixi/core';
import { Prepare } from '@pixi/prepare';
import { DisplacementFilter } from '@pixi/filter-displacement';
import { WRAP_MODES } from '@pixi/constants';
import { DisplayObject } from '@pixi/display';
import { gsap } from 'gsap';
import { PixiPlugin } from 'gsap/PixiPlugin';

Renderer.registerPlugin('prepare', Prepare);
Renderer.registerPlugin('batch', BatchRenderer);
Application.registerPlugin(TickerPlugin);
Application.registerPlugin(AppLoaderPlugin);
gsap.registerPlugin(PixiPlugin);

const filters = { DisplacementFilter };

PixiPlugin.registerPIXI({
  DisplayObject,
  filters,
  VERSION: '5.3.3',
});

export {
  Application,
  Spritesheet,
  Sprite,
  WRAP_MODES,
  filters,
};
