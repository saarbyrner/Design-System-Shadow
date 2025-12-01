import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import useFormSetup from '../useFormSetup';

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  formValidationSlice: {},
  formMenuSlice: {},
  formStateSlice: {},
});

const wrapper = ({ children }) => {
  return <Provider store={defaultStore}>{children}</Provider>;
};

describe('useFormSetup', () => {
  describe('initial state', () => {
    it('has initial state', () => {
      const result = renderHook(() => useFormSetup(), {
        wrapper,
      }).result;
      expect(result.current.onInitialiseForm).toStrictEqual(
        expect.any(Function)
      );
    });
  });
  describe('setting form state', () => {
    const useDispatchMock = jest.fn();
    beforeEach(() => {
      defaultStore.dispatch = useDispatchMock;
    });
    it('correctly sets form state', () => {
      const { result } = renderHook(() => useFormSetup(), {
        wrapper,
      });

      const MOCK_FORM = {
        form_template_version: {
          form_elements: [],
        },
      };

      act(() => {
        result.current.onInitialiseForm({
          root: MOCK_FORM,
          mode: 'VIEW',
        });
      });

      expect(useDispatchMock).toHaveBeenNthCalledWith(1, {
        payload: {
          menuGroupIndex: 0,
          menuItemIndex: 0,
        },
        type: 'formMenuSlice/onSetActiveMenu',
      });

      expect(useDispatchMock).toHaveBeenNthCalledWith(2, {
        payload: {
          structure: MOCK_FORM,
        },
        type: 'formStateSlice/onSetFormStructure',
      });

      expect(useDispatchMock).toHaveBeenNthCalledWith(3, {
        payload: { mode: 'VIEW' },
        type: 'formStateSlice/onSetMode',
      });

      expect(useDispatchMock).toHaveBeenNthCalledWith(4, {
        payload: { elements: [] },
        type: 'formStateSlice/onBuildFormState',
      });

      expect(useDispatchMock).toHaveBeenNthCalledWith(5, {
        payload: { formAnswers: [] },
        type: 'formStateSlice/onSetFormAnswersSet',
      });

      expect(useDispatchMock).toHaveBeenNthCalledWith(6, {
        payload: { elements: [] },
        type: 'formValidationSlice/onBuildValidationState',
      });

      expect(useDispatchMock).toHaveBeenNthCalledWith(7, {
        payload: { elements: [] },
        type: 'formMenuSlice/onBuildFormMenu',
      });

      expect(useDispatchMock).toHaveBeenNthCalledWith(8, {
        payload: { showMenuIcons: false },
        type: 'formStateSlice/onUpdateShowMenuIcons',
      });
    });
  });
});
