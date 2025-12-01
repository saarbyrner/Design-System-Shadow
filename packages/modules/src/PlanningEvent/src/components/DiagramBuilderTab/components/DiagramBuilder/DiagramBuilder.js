// @flow
import { useRef, useCallback, useEffect, useState } from 'react';
import { Point } from 'pixi.js';

import { Sprite, Graphics } from '@kitman/common/src/pixi/components';
import { usePixiApp } from '@kitman/common/src/pixi/hooks';
import { type PixiTicker } from '@kitman/common/src/pixi/types';

export default () => {
  const app = usePixiApp();
  const ballPath =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Soccerball.svg/480px-Soccerball.svg.png';

  const elapsed = useRef(0.0);
  const [backAndForthBall, setBackAndForthBall] = useState<{
    x: number,
    rotation: number,
  }>({
    x: 300,
    rotation: 0,
  });

  const backAndForther = (t: PixiTicker) => {
    elapsed.current += t.deltaTime;
    setBackAndForthBall(({ rotation }) => ({
      x: 100.0 + Math.cos(elapsed.current / 50.0) * 100.0,
      rotation: rotation + 0.1 * t.deltaTime,
    }));
  };

  const [cursorFollowingBall, setCursorFollowingBall] = useState<{
    x: number,
    y: number,
  }>({
    x: 300,
    y: 250,
  });

  const [lineFollowingBall, setLineFollowingBall] = useState<{
    x: number,
    y: number,
  }>({
    x: 300,
    y: 250,
  });

  const onPointerMove = useCallback((e) => {
    setCursorFollowingBall({ x: e.global.x, y: e.global.y });
  }, []);

  const points = useRef([]);
  const currentPointIndex = useRef(0);
  const arePointsDrawn = useRef(false);

  const draw = useCallback(
    (g) => {
      if (!app) return;
      let isDragging = false;
      let lastDrawnPoint = null;

      const onDraw = ({ global: { x, y } }) => {
        if (!isDragging) return;
        const point = new Point(x, y);
        if (lastDrawnPoint) {
          g.stroke({ width: 1, color: 0xff0000 })
            .moveTo(lastDrawnPoint.x, lastDrawnPoint.y)
            .lineTo(point.x, point.y);
        }
        lastDrawnPoint = point;
        points.current.push(lastDrawnPoint);
      };

      const onDrawStart = (e) => {
        isDragging = true;
        arePointsDrawn.current = false;
        onDraw(e);
      };

      const onDrawStop = () => {
        isDragging = false;
        arePointsDrawn.current = true;
        g.clear();
      };

      const onRightDown = () => {
        g.clear();
      };

      app.stage.eventMode = 'static';
      app.stage.hitArea = app.screen;
      app.stage
        .on('pointerdown', onDrawStart)
        .on('pointerup', onDrawStop)
        .on('pointerupoutside', onDrawStop)
        .on('pointermove', onDraw)
        .on('rightdown', onRightDown);
    },
    [app]
  );

  const traversePathIfExists = useCallback(() => {
    if (!arePointsDrawn.current) return;
    const point = points.current[currentPointIndex.current];
    if (!point) return;
    setLineFollowingBall({ x: point.x, y: point.y });
    currentPointIndex.current += 1;
  }, []);

  useEffect(() => {
    if (!app) return () => {};
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;

    app.ticker.add(backAndForther);
    app.ticker.add(traversePathIfExists);

    app.stage.addEventListener('pointermove', onPointerMove);

    return () => {
      if (!app) return;
      if (app.stage) {
        app.stage.removeEventListener('pointermove', onPointerMove);
      }
      if (app.ticker) {
        app.ticker.remove(backAndForther);
        app.ticker.remove(traversePathIfExists);
      }
    };
  }, [app]);

  return (
    <>
      <Sprite
        {...backAndForthBall}
        y={250}
        width={32}
        height={32}
        anchor={0.5}
        image={ballPath}
        cursor="pointer"
        roundPixels
      />
      <Sprite
        {...cursorFollowingBall}
        width={32}
        height={32}
        anchor={0.5}
        image={ballPath}
        cursor="pointer"
      />
      <Sprite
        {...lineFollowingBall}
        width={32}
        height={32}
        anchor={0.5}
        image={ballPath}
        cursor="pointer"
      />
      <Graphics draw={draw} />
    </>
  );
};
