import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';

import MOCK_MENU from '@kitman/modules/src/HumanInput/__tests__/mock_menu';
import useFormNavigation from '../useFormNavigation';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const store = storeFake({
  formStateSlice: {},
  formMenuSlice: {
    menu: {
      ...MOCK_MENU,
    },
    drawer: {
      isOpen: true,
    },
    active: {
      menuGroupIndex: 0,
      menuItemIndex: 0,
    },
  },
  formValidationSlice: {},
});

describe('useFormNavigation', () => {
  let renderHookResult;
  it('has inital data', async () => {
    await act(async () => {
      renderHookResult = renderHook(() => useFormNavigation(), {
        wrapper: ({ children }) => (
          <Provider store={store}>{children}</Provider>
        ),
      }).result;
    });
    expect(renderHookResult.current).toHaveProperty('isNextDisabled');
    expect(renderHookResult.current.isNextDisabled).toEqual(false);
    expect(renderHookResult.current).toHaveProperty('isPreviousDisabled');
    expect(renderHookResult.current.isPreviousDisabled).toEqual(true);
    expect(renderHookResult.current).toHaveProperty('onHandleNext');
    expect(renderHookResult.current).toHaveProperty('onHandlePrevious');
  });

  describe('computed data', () => {
    it('correctly returns isPreviousDisabled as false', async () => {
      const localStore = storeFake({
        formStateSlice: {},
        formMenuSlice: {
          menu: {
            ...MOCK_MENU,
          },
          drawer: {
            isOpen: true,
          },
          active: {
            menuGroupIndex: 1,
            menuItemIndex: 0,
          },
        },
        formValidationSlice: {},
      });
      await act(async () => {
        renderHookResult = renderHook(() => useFormNavigation(), {
          wrapper: ({ children }) => (
            <Provider store={localStore}>{children}</Provider>
          ),
        }).result;
      });
      expect(renderHookResult.current.isPreviousDisabled).toEqual(false);
    });
    it('correctly returns isNextDisabled as true', async () => {
      const localStore = storeFake({
        formStateSlice: {},
        formMenuSlice: {
          menu: {
            ...MOCK_MENU,
          },
          drawer: {
            isOpen: true,
          },
          active: {
            menuGroupIndex: 3,
            menuItemIndex: 0,
          },
        },
        formValidationSlice: {},
      });
      await act(async () => {
        renderHookResult = renderHook(() => useFormNavigation(), {
          wrapper: ({ children }) => (
            <Provider store={localStore}>{children}</Provider>
          ),
        }).result;
      });
      expect(renderHookResult.current.isNextDisabled).toEqual(true);
    });
  });
});
