import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import {
  useFetchScoutQuery,
  useFetchFormStructureQuery,
} from '@kitman/modules/src/Scouts/shared/redux/services';

import { initialState as initialFormState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formStateSlice';
import { initialState as initialValidationState } from '@kitman/modules/src/HumanInput/shared/redux/slices/formValidationSlice';

import useInitialiseForm from '../useInitialiseForm';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/modules/src/Scouts/shared/redux/services');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const props = {
  mode: 'CREATE',
  userType: 'scout',
};

const defaultStore = {
  formStateSlice: initialFormState,
  formMenuSlice: {},
  formValidationSlice: initialValidationState,
};

const store = storeFake(defaultStore);

const renderTestComponent = () => {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
};

const mockRTKQueries = (
  state = { isLoading: true, isError: false, isSuccess: false, data: {} }
) => {
  useFetchFormStructureQuery.mockReturnValue(state);
  useFetchScoutQuery.mockReturnValue(state);
};

describe('useInitialiseForm', () => {
  describe('CREATE mode', () => {
    describe('[INITIAL STATE]', () => {
      beforeEach(() => {
        mockRTKQueries({
          data: null,
          isLoading: true,
        });
      });
      let renderHookResult;

      it('has inital data', async () => {
        await act(async () => {
          renderHookResult = renderHook(() => useInitialiseForm({ ...props }), {
            wrapper: renderTestComponent(null),
          }).result;
        });
        expect(renderHookResult.current).toHaveProperty('isLoading');
        expect(renderHookResult.current).toHaveProperty('hasFailed');
        expect(renderHookResult.current).toHaveProperty('isSuccess');
        expect(renderHookResult.current.isLoading).toEqual(true);
        expect(renderHookResult.current.hasFailed).toEqual(false);
        expect(renderHookResult.current.isSuccess).toEqual(false);
      });
    });

    describe('[FAILURE STATE]', () => {
      let renderHookResult;
      beforeEach(() => {
        mockRTKQueries({
          data: null,
          isError: true,
        });
      });
      it('has inital data', async () => {
        await act(async () => {
          renderHookResult = renderHook(() => useInitialiseForm({ ...props }), {
            wrapper: renderTestComponent('FAILURE'),
          }).result;
        });
        expect(renderHookResult.current).toHaveProperty('isLoading');
        expect(renderHookResult.current).toHaveProperty('hasFailed');
        expect(renderHookResult.current).toHaveProperty('isSuccess');
        expect(renderHookResult.current.isLoading).toEqual(false);
        expect(renderHookResult.current.hasFailed).toEqual(true);
        expect(renderHookResult.current.isSuccess).toEqual(false);
      });
    });

    describe('[SUCCESS STATE]', () => {
      let renderHookResult;
      beforeEach(() => {
        mockRTKQueries({
          data: null,
          isSuccess: true,
        });
      });
      it('has inital data', async () => {
        await act(async () => {
          renderHookResult = renderHook(() => useInitialiseForm({ ...props }), {
            wrapper: renderTestComponent('SUCCESS'),
          }).result;
        });
        expect(renderHookResult.current).toHaveProperty('isLoading');
        expect(renderHookResult.current).toHaveProperty('hasFailed');
        expect(renderHookResult.current).toHaveProperty('isSuccess');
        expect(renderHookResult.current.isLoading).toEqual(false);
        expect(renderHookResult.current.hasFailed).toEqual(false);
        expect(renderHookResult.current.isSuccess).toEqual(true);
      });
    });
  });
  describe('Edit mode', () => {
    describe('[INITIAL STATE]', () => {
      beforeEach(() => {
        mockRTKQueries({
          data: null,
          isLoading: true,
        });
      });
      let renderHookResult;

      it('has inital data', async () => {
        await act(async () => {
          renderHookResult = renderHook(
            () => useInitialiseForm({ ...props, mode: 'EDIT', id: '1' }),
            {
              wrapper: renderTestComponent(null),
            }
          ).result;
        });
        expect(renderHookResult.current).toHaveProperty('isLoading');
        expect(renderHookResult.current).toHaveProperty('hasFailed');
        expect(renderHookResult.current).toHaveProperty('isSuccess');
        expect(renderHookResult.current.isLoading).toEqual(true);
        expect(renderHookResult.current.hasFailed).toEqual(false);
        expect(renderHookResult.current.isSuccess).toEqual(false);
      });
    });

    describe('[FAILURE STATE]', () => {
      let renderHookResult;
      beforeEach(() => {
        mockRTKQueries({
          data: null,
          isError: true,
        });
      });
      it('has inital data', async () => {
        await act(async () => {
          renderHookResult = renderHook(
            () => useInitialiseForm({ ...props, mode: 'EDIT', id: '1' }),
            {
              wrapper: renderTestComponent('FAILURE'),
            }
          ).result;
        });
        expect(renderHookResult.current).toHaveProperty('isLoading');
        expect(renderHookResult.current).toHaveProperty('hasFailed');
        expect(renderHookResult.current).toHaveProperty('isSuccess');
        expect(renderHookResult.current.isLoading).toEqual(false);
        expect(renderHookResult.current.hasFailed).toEqual(true);
        expect(renderHookResult.current.isSuccess).toEqual(false);
      });
    });

    describe('[SUCCESS STATE]', () => {
      let renderHookResult;
      beforeEach(() => {
        mockRTKQueries({
          data: null,
          isSuccess: true,
        });
      });
      it('has inital data', async () => {
        await act(async () => {
          renderHookResult = renderHook(
            () => useInitialiseForm({ ...props, mode: 'EDIT', id: '1' }),
            {
              wrapper: renderTestComponent('SUCCESS'),
            }
          ).result;
        });
        expect(renderHookResult.current).toHaveProperty('isLoading');
        expect(renderHookResult.current).toHaveProperty('hasFailed');
        expect(renderHookResult.current).toHaveProperty('isSuccess');
        expect(renderHookResult.current.isLoading).toEqual(false);
        expect(renderHookResult.current.hasFailed).toEqual(false);
        expect(renderHookResult.current.isSuccess).toEqual(true);
      });
    });
  });
});
