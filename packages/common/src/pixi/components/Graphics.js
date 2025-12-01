// @flow
import { useState, useEffect } from 'react';
import { Graphics } from 'pixi.js';

import { usePixiApp } from '@kitman/common/src/pixi/hooks';
import { destroyDefaultArguments } from '@kitman/common/src/pixi/constants';
import { type PixiApp, type PixiGraphics } from '@kitman/common/src/pixi/types';

export type GraphicsProps = {
  // draw is called every time it’s changed so make sure to memoize passed
  // callbacks via useCallback.
  //
  // george: not my decision, just for compliance with the official wrapper to
  // which we will once migrate.
  draw?: (graphics: PixiGraphics) => void,
};

// Graphics represents PixiJS.Graphics. It must be compatible with
// React Pixi’s API where possible. It’s not a component in it’s
// normal meaning: it doesn’t accept child components nor renders
// anything.
//
// Example:
//
// <Graphics draw={draw} />
export default ({ draw }: GraphicsProps) => {
  const app: PixiApp = usePixiApp();
  const [graphics] = useState<PixiGraphics>(new Graphics());

  useEffect(() => {
    if (!graphics) return;
    draw?.(graphics);
  }, [draw]);

  useEffect(() => {
    if (!app) return () => {};
    app.stage.addChild(graphics);
    return () => {
      graphics.destroy(destroyDefaultArguments);
      if (app.stage) app.stage.removeChild(graphics);
    };
  }, [app]);

  return null;
};
