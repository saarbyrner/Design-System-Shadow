import MOCK_MENU from '@kitman/modules/src/HumanInput/__tests__/mock_menu';

import {
  getMenuState,
  getDrawerState,
  getActiveMenuState,
  getDrawerIsOpenFactory,
  getActiveMenuGroupFactory,
  getActiveMenuItemFactory,
  getIsLastMenuGroupFactory,
  getIsLastMenuItemFactory,
} from '../formMenuSelectors';

const MOCK_STATE = {
  registrationFormApi: {},
  registrationApi: {},
  formMenuSlice: {
    menu: {
      title: 'Menu',
      items: ['one', 'two'],
    },
    drawer: {
      isOpen: false,
    },
    active: {
      menuGroupIndex: 0,
      menuItemIndex: 0,
    },
  },
};

describe('[formMenuSelectors] - selectors', () => {
  test('getFormState()', () => {
    expect(getMenuState(MOCK_STATE)).toBe(MOCK_STATE.formMenuSlice.menu);
  });

  test('getDrawerState()', () => {
    expect(getDrawerState(MOCK_STATE)).toBe(MOCK_STATE.formMenuSlice.drawer);
  });

  test('getActiveMenuState()', () => {
    expect(getActiveMenuState(MOCK_STATE)).toBe(
      MOCK_STATE.formMenuSlice.active
    );
  });

  test('getDrawerIsOpenFactory()', () => {
    const selector = getDrawerIsOpenFactory();
    expect(selector(MOCK_STATE)).toBe(MOCK_STATE.formMenuSlice.drawer.isOpen);
  });

  test('getActiveMenuGroupFactory()', () => {
    const selector = getActiveMenuGroupFactory();
    expect(selector(MOCK_STATE)).toBe(
      MOCK_STATE.formMenuSlice.active.menuGroupIndex
    );
  });

  test('getActiveMenuItemFactory()', () => {
    const selector = getActiveMenuItemFactory();
    expect(selector(MOCK_STATE)).toBe(
      MOCK_STATE.formMenuSlice.active.menuItemIndex
    );
  });

  test('getIsLastMenuGroupFactory()', () => {
    const selector = getIsLastMenuGroupFactory();
    expect(
      selector({
        formMenuSlice: {
          menu: MOCK_MENU,
          active: {
            menuGroupIndex: 3,
            menuItemIndex: 0,
          },
        },
      })
    ).toBe(true);
  });

  test('getIsLastMenuItemFactory()', () => {
    const selector = getIsLastMenuItemFactory();
    expect(
      selector({
        formMenuSlice: {
          menu: MOCK_MENU,
          active: {
            menuGroupIndex: 2,
            menuItemIndex: 8,
          },
        },
      })
    ).toBe(true);
  });
});
