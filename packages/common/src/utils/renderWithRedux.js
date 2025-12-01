// @flow
import { jest } from '@jest/globals';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '@kitman/modules/src/AppRoot/store';

export const storeFake = (state: Object) => ({
  default: jest.fn(),
  subscribe: jest.fn(),
  dispatch: jest.fn(),
  getState: () => ({ ...state }),
});

/**
 * This function wraps the RTL render function with a Redux provider.
 *
 * @param {Node} componentToRender Component to render.
 * @param {Object} preloadedState The Redux state that will be loaded into the store.
 * @param {boolean} useGlobalStore boolean that determines whether it uses the entire Redux global store or the local one passed in.
 * @returns React Testing Library render return.
 */

const renderWithRedux = (
  componentToRender: Node,
  {
    preloadedState = {},
    useGlobalStore = true,
  }: {
    preloadedState?: Object,
    useGlobalStore?: boolean,
  } = {
    preloadedState: {},
    useGlobalStore: true,
  }
) => {
  let mockedStore;
  if (useGlobalStore) {
    mockedStore = setupStore(preloadedState);
  } else {
    mockedStore = storeFake(preloadedState);
  }
  const Wrapper = ({ children }) => (
    <Provider store={mockedStore}>{children}</Provider>
  );

  return {
    mockedStore,
    ...render(componentToRender, {
      wrapper: Wrapper,
      preloadedState,
      mockedStore,
    }),
  };
};

export default renderWithRedux;
