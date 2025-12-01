import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { buildMenuGroup } from '@kitman/modules/src/HumanInput/__tests__/mock_utils';

import { initialState as initialFormMenuState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';
import { initialState as initialFormState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { initialState as initialValidationState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import MenuGroup from '../MenuGroup';

const props = {
  formMenuItem: {
    element_type: 'Forms::Elements::Layouts::MenuGroup',
    index: 0,
    items: [
      {
        element_type: 'Forms::Elements::Layouts::MenuGroup',
        index: 0,
        fields: [],
        items: [],
        key: 'my_menu_group_menu_item_0',
        title: 'My Menu group MenuItem 0',
      },
      {
        element_type: 'Forms::Elements::Layouts::MenuGroup',
        index: 1,
        items: [],
        fields: [],
        key: 'my_menu_group_menu_item_1',
        title: 'My Menu group MenuItem 1',
      },
      {
        element_type: 'Forms::Elements::Layouts::MenuGroup',
        index: 2,
        items: [],
        fields: [],
        key: 'my_menu_group_menu_item_2',
        title: 'My Menu group MenuItem 2',
      },
    ],
    key: 'my_menu_group_item',
    title: 'My Menu group item',
    fields: [],
  },
  onClick: Function,
  isActive: false,
  showMenuIcons: true,
};

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
  },
});

describe('<MenuGroup/>', () => {
  it('renders full setps completed menu group', () => {
    render(
      <Provider store={localStore}>
        <MenuGroup {...props} />
      </Provider>
    );
    expect(screen.getByText(/My Menu group item/i)).toBeInTheDocument();
    expect(screen.getByText(/0 of 3 steps completed/i)).toBeInTheDocument();
    expect(screen.getByTestId('DonutLargeIcon')).toBeInTheDocument();
  });

  it('renders partially completed menu group', () => {
    render(
      <Provider
        store={storeFake({
          ...defaultStore,
          formValidationSlice: {
            validation: {
              11: {
                status: 'VALID',
                message: null,
              },
              12: {
                status: 'VALID',
                message: null,
              },
              13: {
                status: 'INVALID',
                message: 'Required',
              },
              14: {
                status: 'INVALID',
                message: 'Required',
              },
              15: {
                status: 'VALID',
                message: null,
              },
            },
          },
        })}
      >
        <MenuGroup
          {...props}
          formMenuItem={{
            ...props.formMenuItem,
            items: [
              {
                element_type: 'Forms::Elements::Layouts::MenuGroup',
                index: 0,
                items: [],
                fields: [11],
                key: 'my_menu_group_menu_item_0',
                title: 'My Menu group MenuItem 0',
              },
              {
                element_type: 'Forms::Elements::Layouts::MenuGroup',
                index: 1,
                fields: [12, 13],
                items: [],
                key: 'my_menu_group_menu_item_1',
                title: 'My Menu group MenuItem 1',
              },
              {
                element_type: 'Forms::Elements::Layouts::MenuGroup',
                index: 2,
                fields: [14, 15],
                items: [],
                key: 'my_menu_group_menu_item_2',
                title: 'My Menu group MenuItem 2',
              },
            ],
          }}
        />
      </Provider>
    );
    expect(screen.getByText(/My Menu group item/i)).toBeInTheDocument();
    expect(screen.getByText(/1 of 3 steps completed/i)).toBeInTheDocument();
    expect(screen.getByTestId('DonutLargeIcon')).toBeInTheDocument();
  });

  it('renders without icon', () => {
    render(
      <Provider store={localStore}>
        <MenuGroup {...props} showMenuIcons={false} />
      </Provider>
    );
    expect(screen.getByText(/My Menu group item/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/3 of 3 steps completed/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('CheckCircleIcon')).not.toBeInTheDocument();
  });
});
