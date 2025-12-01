import { screen, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { initialState as initialFormMenuState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formMenuSlice';
import { initialState as initialFormState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { initialState as initialValidationState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';
import Menu from '../Menu';

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

const buildMenuItem = (title, index) => {
  return {
    key: title,
    index,
    title,
    element_type: 'Forms::Elements::Layouts::MenuItem',
    fields: [],
  };
};

const buildMenuGroup = (title, index, itemCount) => {
  return {
    key: title,
    index,
    title,
    element_type: 'Forms::Elements::Layouts::MenuGroup',
    items: Array(itemCount)
      .fill()
      .map((item, idx) => buildMenuItem(`${title} Sub-section ${idx}`, idx)),
    fields: [],
  };
};

describe('<Menu/>', () => {
  it('renders a simple menu', () => {
    const localStore = storeFake({
      ...defaultStore,
      formMenuSlice: {
        ...initialFormMenuState,
        menu: {
          key: 'menu',
          index: 0,
          title: 'My registration form',
          element_type: 'Forms::Elements::Layouts::Menu',
          items: [buildMenuGroup('Section 1', 0, 3)],
          fields: [],
        },
      },
      formStateSlice: {
        ...initialFormState,
        config: {
          showMenuIcons: true,
        },
      },
    });
    render(
      <Provider store={localStore}>
        <Menu />
      </Provider>
    );
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText(/0 of 3 steps completed/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 1 Sub-section 0/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 1 Sub-section 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 1 Sub-section 2/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('DonutLargeIcon')).toHaveLength(4);
  });

  it('renders a larger menu with the initial group expanded', () => {
    const localStore = storeFake({
      ...defaultStore,
      formMenuSlice: {
        ...initialFormMenuState,
        menu: {
          key: 'menu',
          index: 0,
          title: 'My registration form',
          element_type: 'Forms::Elements::Layouts::Menu',
          items: [
            buildMenuGroup('Section 1', 0, 3),
            buildMenuGroup('Section 2', 0, 4),
          ],
          fields: [],
        },
      },
      formStateSlice: {
        ...initialFormState,
        config: {
          showMenuIcons: true,
        },
      },
    });
    render(
      <Provider store={localStore}>
        <Menu />
      </Provider>
    );
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
    expect(screen.getByText(/0 of 3 steps completed/i)).toBeInTheDocument();
    expect(screen.getByText(/0 of 4 steps completed/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 1 Sub-section 0/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 1 Sub-section 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 1 Sub-section 2/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('DonutLargeIcon')).toHaveLength(5);
  });

  it('renders a larger menu with an explicit active group expanded', () => {
    const localStore = storeFake({
      ...defaultStore,
      formMenuSlice: {
        ...initialFormMenuState,
        menu: {
          key: 'menu',
          index: 0,
          title: 'My registration form',
          element_type: 'Forms::Elements::Layouts::Menu',
          items: [
            buildMenuGroup('Section 1', 0, 3),
            buildMenuGroup('Section 2', 0, 4),
          ],
          fields: [],
        },
        active: {
          menuGroupIndex: 1,
          menuItemIndex: 0,
        },
      },
      formStateSlice: {
        ...initialFormState,
        config: {
          showMenuIcons: true,
        },
      },
    });
    render(
      <Provider store={localStore}>
        <Menu />
      </Provider>
    );
    expect(screen.getByText('Section 1')).toBeInTheDocument();
    expect(screen.getByText('Section 2')).toBeInTheDocument();
    expect(screen.getByText(/0 of 3 steps completed/i)).toBeInTheDocument();
    expect(screen.getByText(/0 of 4 steps completed/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 2 Sub-section 0/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 2 Sub-section 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 2 Sub-section 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 2 Sub-section 3/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('DonutLargeIcon')).toHaveLength(6);
  });

  it('renders menu without an icon', () => {
    const localStore = storeFake({
      ...defaultStore,
      formMenuSlice: {
        ...initialFormMenuState,
        menu: {
          key: 'menu',
          index: 0,
          title: 'My registration form',
          element_type: 'Forms::Elements::Layouts::Menu',
          items: [
            buildMenuGroup('Section 1', 0, 3),
            buildMenuGroup('Section 2', 0, 4),
          ],
          fields: [],
        },
        active: {
          menuGroupIndex: 1,
          menuItemIndex: 0,
        },
      },
      formStateSlice: {
        ...initialFormState,
        config: {
          showMenuIcons: false,
        },
      },
    });
    render(
      <Provider store={localStore}>
        <Menu />
      </Provider>
    );
    expect(screen.queryByTestId('DonutLargeIcon')).not.toBeInTheDocument();
  });
});
