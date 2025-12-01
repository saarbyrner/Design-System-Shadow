import { render, waitFor } from '@testing-library/react';

import { Pixi } from '@kitman/common/src/pixi/contexts';
import { destroyDefaultArguments } from '@kitman/common/src/pixi/constants';
import Sprite from '../Sprite';

jest.mock('pixi.js', () => ({
  Sprite: jest.fn(({ image }) => ({
    destroy: jest.fn(),
    anchor: {
      set: jest.fn(),
    },
    image,
  })),
  Assets: {
    load: jest.fn((image) => ({
      destroy: jest.fn(),
      anchor: {
        set: jest.fn(),
      },
      image,
    })),
  },
}));

const defaultProps = {
  x: 0,
  y: 1,
  width: 2,
  height: 3,
  anchor: 0.5,
  image: 'image path',
  roundPixels: true,
  cursor: 'pointer',
};

const getNewApp = () => ({
  stage: {
    addChild: jest.fn(),
    removeChild: jest.fn(),
  },
});

const renderSprite = (app, props) => {
  const { rerender, unmount } = render(
    <Pixi.Provider value={app}>
      <Sprite {...props} />
    </Pixi.Provider>
  );

  return {
    rerender: (newApp, newProps) =>
      rerender(
        <Pixi.Provider value={newApp}>
          <Sprite {...newProps} />
        </Pixi.Provider>
      ),
    unmount,
  };
};

describe('<Sprite />', () => {
  describe('props', () => {
    it('correctly uses them', async () => {
      const app = getNewApp();
      renderSprite(app, defaultProps);

      const calls = app.stage.addChild.mock.calls;
      await waitFor(() => expect(calls.length).toBe(1));

      const callArgs = calls[0];
      expect(callArgs.length).toBe(1);

      const sprite = callArgs[0];
      const expectedSprite = { ...defaultProps };
      delete expectedSprite.anchor;
      expect(sprite.anchor.set).toHaveBeenCalledWith(defaultProps.anchor);
      expect(sprite).toMatchObject(expectedSprite);
    });

    it('correctly handles their changes', async () => {
      const app = getNewApp();
      const { rerender } = renderSprite(app, defaultProps);

      const newProps = {
        x: 1,
        y: 2,
        width: 3,
        height: 4,
        anchor: 1,
        // image can’t be changed.
        image: defaultProps.image,
        roundPixels: false,
        cursor: 'cursor',
      };
      rerender(app, newProps);

      const calls = app.stage.addChild.mock.calls;
      await waitFor(() => expect(calls.length).toBe(1));
      const callArgs = calls[0];
      const sprite = callArgs[0];
      const expectedSprite = { ...newProps };
      delete expectedSprite.anchor;
      expect(sprite.anchor.set).toHaveBeenCalledWith(newProps.anchor);
      expect(sprite).toMatchObject(expectedSprite);
    });
  });

  it('doesn’t create new sprites in app from usePixiApp', async () => {
    const app = getNewApp();
    const { rerender } = renderSprite(app, defaultProps);

    rerender(app, defaultProps);

    await waitFor(() => expect(app.stage.addChild.mock.calls.length).toBe(1));
  });

  it('cleans up itself in app from usePixiApp', async () => {
    const app = getNewApp();
    const { unmount } = renderSprite(app, defaultProps);

    const addChildCalls = app.stage.addChild.mock.calls;
    await waitFor(() => expect(addChildCalls.length).toBe(1));

    unmount();

    const addChildCallArgs = addChildCalls[0];
    const sprite = addChildCallArgs[0];
    expect(sprite.destroy).toHaveBeenCalledWith(destroyDefaultArguments);

    const removeChildCalls = app.stage.removeChild.mock.calls;
    expect(removeChildCalls.length).toBe(1);

    const removeChildCallArgs = removeChildCalls[0];
    expect(removeChildCallArgs.length).toBe(1);

    const spriteToRemove = removeChildCallArgs[0];
    const expectedSprite = { ...defaultProps };
    delete expectedSprite.anchor;
    expect(spriteToRemove).toMatchObject(expectedSprite);
  });
});
