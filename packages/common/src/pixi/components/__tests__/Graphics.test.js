import { render } from '@testing-library/react';

import { Pixi } from '@kitman/common/src/pixi/contexts';
import { destroyDefaultArguments } from '@kitman/common/src/pixi/constants';
import Graphics from '../Graphics';

jest.mock('pixi.js', () => ({
  Graphics: jest.fn(() => ({ destroy: jest.fn() })),
}));

const defaultProps = {
  draw: jest.fn(),
};

const getNewApp = () => ({
  stage: {
    addChild: jest.fn(),
    removeChild: jest.fn(),
  },
});

const renderGraphics = (app, props) => {
  const { rerender, unmount } = render(
    <Pixi.Provider value={app}>
      <Graphics {...props} />
    </Pixi.Provider>
  );

  return {
    rerender: (newApp, newProps) =>
      rerender(
        <Pixi.Provider value={newApp}>
          <Graphics {...newProps} />
        </Pixi.Provider>
      ),
    unmount,
  };
};

describe('<Graphics />', () => {
  describe('props', () => {
    it('correctly uses them', () => {
      const app = getNewApp();
      renderGraphics(app, defaultProps);

      const calls = app.stage.addChild.mock.calls;
      expect(calls.length).toBe(1);

      const call = calls[0];
      expect(call.length).toBe(1);

      const graphics = call[0];
      const expectedGraphics = { destroy: expect.any(Function) };
      expect(graphics).toMatchObject(expectedGraphics);
      expect(defaultProps.draw).toHaveBeenCalledWith(graphics);
    });

    it('correctly handles their changes', () => {
      const app = getNewApp();
      const { rerender } = renderGraphics(app, defaultProps);

      const newProps = { draw: jest.fn() };
      rerender(app, newProps);

      const call = app.stage.addChild.mock.calls[0];
      const graphics = call[0];
      expect(newProps.draw).toHaveBeenCalledWith(graphics);
    });
  });

  it('doesn’t create new graphics in app from usePixiApp', () => {
    const app = getNewApp();
    const { rerender } = renderGraphics(app, defaultProps);

    rerender(app, defaultProps);

    expect(app.stage.addChild.mock.calls.length).toBe(1);
  });

  it('cleans up itself in app from usePixiApp', () => {
    const app = getNewApp();
    const { unmount } = renderGraphics(app, defaultProps);

    unmount();

    const addChildCall = app.stage.addChild.mock.calls[0];
    const graphics = addChildCall[0];
    expect(graphics.destroy).toHaveBeenCalledWith(destroyDefaultArguments);

    const removeChildCalls = app.stage.removeChild.mock.calls;
    expect(removeChildCalls.length).toBe(1);

    const removeChildCall = removeChildCalls[0];
    expect(removeChildCall.length).toBe(1);

    const graphicsToRemove = removeChildCall[0];
    const expectedGraphics = { destroy: expect.any(Function) };
    expect(graphicsToRemove).toMatchObject(expectedGraphics);
  });
});
