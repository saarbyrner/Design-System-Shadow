// @flow
import { useState, useRef, useEffect } from 'react';
import type { Node } from 'react';
import { Application } from 'pixi.js';

import { destroyDefaultArguments } from '@kitman/common/src/pixi/constants';
import { Pixi } from '@kitman/common/src/pixi/contexts';
import { type PixiApp } from '@kitman/common/src/pixi/types';

export type StageProps = {
  width: number,
  height: number,
  background: string,
  children: Node,
};

// Stage represents PixiJS.Application. It must be compatible with React Pixi’s
// API. It’s the only component that accepts child components.
//
// george: this file doesn’t have a test file because I couldn’t setup Jest to
// test <canvas />. Probably it’s because PixiJS uses WebGL.
//
// Example:
//
// <Stage width={600} height={500} background="#1099bb">
//   <Sprite
//     x={300}
//     y={250}
//     image={ballPath}
//   />
// </Stage>
export default ({ width, height, background, children }: StageProps) => {
  // setAppOnce must be called only once.
  const [app, setAppOnce] = useState<PixiApp>();
  const canvasRef = useRef<?HTMLCanvasElement>(null);

  useEffect(() => {
    const getAndSetAppOnce = async () => {
      const newApp = new Application();
      await newApp.init({
        width,
        height,
        background,
      });
      setAppOnce(newApp);
    };
    getAndSetAppOnce();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!(app && canvas)) return () => {};
    canvas.parentNode?.replaceChild(app.canvas, canvas);
    return () => {
      app.stop();
      app.destroy(destroyDefaultArguments);
      // parentNode.removeChild call is the reason we need a parent div.
      canvas.parentNode?.removeChild(app.canvas);
    };
  }, [app]);

  return (
    <Pixi.Provider value={app}>
      {/* A div to make sure there is always a parent node. */}
      <div>
        <canvas ref={canvasRef} />
        {/* Even though children don’t render anything, we still need to render */}
        {/* them to run their initializations and callbacks.                    */}
        {children}
      </div>
    </Pixi.Provider>
  );
};
