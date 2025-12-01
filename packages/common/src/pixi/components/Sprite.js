// @flow
import { useState, useEffect } from 'react';
import { Sprite, Assets } from 'pixi.js';

import { usePixiApp } from '@kitman/common/src/pixi/hooks';
import { destroyDefaultArguments } from '@kitman/common/src/pixi/constants';
import { type PixiApp, type PixiSprite } from '@kitman/common/src/pixi/types';

export type SpriteProps = {
  x: number,
  y: number,
  image: string,
  width?: number,
  height?: number,
  // For anchor:
  // - 0 means top left;
  // - 0.5 means center;
  // - 1 means bottom right.
  // Internally, anchor sets x and y independently, passing one parameter is a
  // shorthand for both. You can also pass {x, y}.
  anchor?: number | { x: number, y: number },
  rotation?: number,
  // roundPixels makes text sharper and render things faster sacrificing image
  // smoothness when it’s moving. It calls Math.floor on its x and y which
  // stops pixels interpolation.
  roundPixels?: boolean,
  cursor?: string,
};

// Sprite represents PixiJS.Sprite. It must be compatible with React Pixi’s API
// where possible. It’s not a component in it’s normal meaning: it doesn’t
// accept child components nor renders anything.
//
// Example:
//
// <Sprite
//   x={300}
//   y={250}
//   width={32}
//   height={32}
//   anchor={0.5} // anchor={{x: 0.5, y: 0.5}}
//   image={ballPath} // IMPORTANT: can’t be changed!
//   roundPixels
//   cursor="pointer"
// />
export default ({
  x,
  y,
  width,
  height,
  anchor,
  rotation,
  image,
  roundPixels,
  cursor,
}: SpriteProps) => {
  const app: PixiApp = usePixiApp();
  const [sprite, setSpriteOnce] = useState<PixiSprite>();
  // We don’t use useState’s setSprite because we don’t want to trigger
  // unnecessary React re-render as PixiJS operates out of React’s context.
  const setSprite = () => {
    if (!sprite) return;
    sprite.x = x;
    sprite.y = y;
    if (width) sprite.width = width;
    if (height) sprite.height = height;
    if (anchor) sprite.anchor.set(anchor);
    if (rotation) sprite.rotation = rotation;
    sprite.roundPixels = roundPixels;
    if (cursor) sprite.cursor = cursor;
  };
  useEffect(() => {
    const getAndSetSpriteOnce = async () => {
      const img = await Assets.load(image);
      setSpriteOnce(new Sprite(img));
    };
    getAndSetSpriteOnce();
  }, []);

  useEffect(setSprite, [
    x,
    y,
    width,
    height,
    anchor,
    rotation,
    roundPixels,
    cursor,
    sprite,
  ]);

  useEffect(() => {
    if (!(app && sprite)) return () => {};
    app.stage.addChild(sprite);
    return () => {
      sprite.destroy(destroyDefaultArguments);
      if (app.stage) app.stage.removeChild(sprite);
    };
  }, [app, sprite]);

  return null;
};
