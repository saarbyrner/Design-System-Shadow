import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import {
  initialState as initialFormMenuState,
  initialState as initialFormState,
} from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { initialState as initialValidationState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import { buildMenuGroup } from '@kitman/modules/src/HumanInput/__tests__/mock_utils';
import MenuItem from '../MenuItem';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = {
  registrationApi: {},
  registrationFormApi: {},
  formStateSlice: initialFormState,
  formMenuSlice: initialFormMenuState,
  formValidationSlice: initialValidationState,
};

const localStore = storeFake({
  ...defaultStore,
  formMenuSlice: {
    ...initialFormMenuState,
    menu: {
      key: 'menu',
      index: 0,
      title: 'My registration form',
      element_type: 'Forms::Elements::Layouts::Menu',
      items: [buildMenuGroup('Menu Group 1', 0, 3)],
      fields: [],
    },
    drawer: {
      isOpen: true,
    },
  },
  formStateSlice: {
    ...initialFormState,
    config: {
      showMenuIcons: true,
    },
  },
});

const props = {
  formMenuItem: {
    element_type: 'Forms::Elements::Layouts::MenuItem',
    index: 0,
    items: [],
    fields: [],
    key: 'my_menu_item',
    title: 'My Menu item',
  },
  onClick: Function,
  isActive: false,
  showMenuIcons: true,
};

describe('<MenuItem/>', () => {
  it('renders', () => {
    render(
      <Provider store={localStore}>
        <MenuItem {...props} />
      </Provider>
    );
    expect(screen.getByTestId('DonutLargeIcon')).toBeInTheDocument();
    expect(screen.getByText(/My Menu item/i)).toBeInTheDocument();
  });

  it('renders when isActive', () => {
    render(
      <Provider store={localStore}>
        <MenuItem {...props} isActive />
      </Provider>
    );
    expect(screen.getByTestId('DonutLargeIcon')).toBeInTheDocument();
    expect(screen.getByText(/My Menu item/i)).toBeInTheDocument();
  });

  it('renders without icon', () => {
    render(
      <Provider store={localStore}>
        <MenuItem {...props} showMenuIcons={false} />
      </Provider>
    );
    expect(screen.queryByTestId('DonutLargeIcon')).not.toBeInTheDocument();
    expect(screen.getByText(/My Menu item/i)).toBeInTheDocument();
  });
});
