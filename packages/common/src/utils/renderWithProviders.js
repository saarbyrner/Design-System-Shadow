// @flow
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '@kitman/modules/src/AppRoot/store';
import { PermissionsProvider } from '@kitman/common/src/contexts/PermissionsContext';
import { OrganisationProvider } from '@kitman/common/src/contexts/OrganisationContext';
import LocalizationProvider from '@kitman/playbook/providers/wrappers/LocalizationProvider';

// As documented in: https://redux.js.org/usage/writing-tests#setting-up-a-reusable-test-render-function

export default function renderWithProviders(
  ui: Node,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = setupStore(preloadedState),
    ...renderOptions
  }: Object = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <PermissionsProvider>
          <OrganisationProvider>
            <LocalizationProvider>{children}</LocalizationProvider>
          </OrganisationProvider>
        </PermissionsProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
