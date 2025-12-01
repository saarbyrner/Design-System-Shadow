// @flow
import type { Component } from 'react';
import { Provider } from 'react-redux';
import type { RenderOptions } from '@testing-library/react';
import { render as rtlRender } from '@testing-library/react';
import { setupStore } from '@kitman/modules/src/AppRoot/store';
import type { GlobalStore } from '@kitman/modules/src/AppRoot/store';
import userEvent from '@testing-library/user-event';

export const getWrapper = (preloadedState: GlobalStore, wrapper: ?Function) => {
  const AppReduxWrapper = ({ children }: { children: Node }) => {
    if (typeof wrapper === 'function') {
      return (
        <Provider store={setupStore(preloadedState)}>
          {wrapper({ children })}
        </Provider>
      );
    }
    return <Provider store={setupStore(preloadedState)}>{children}</Provider>;
  };

  return AppReduxWrapper;
};

/**
 * This function wraps the rtl render function, but adds the wrapper needed for component
 *
 * @param {Node} ComponentToRender Component to render
 * @param {RenderOptions} opts react testing library render options excluding the wrapper
 * @param {GlobalStore} preloadedState the redux state that will be loaded into the store
 * @returns React testing library render return
 */
export const render = (
  ComponentToRender: Component<any>,
  opts: RenderOptions,
  preloadedState?: GlobalStore
) => ({
  user: userEvent.setup(),
  ...rtlRender(ComponentToRender, {
    ...opts,
    wrapper: getWrapper(preloadedState || {}, opts?.wrapper),
  }),
});
