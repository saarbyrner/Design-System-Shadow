import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import { useFetchAthleteQuery } from '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi';
import {
  useSearchMovementOrganisationsListQuery,
  usePostMovementRecordMutation,
} from '@kitman/modules/src/UserMovement/shared/redux/services';
import { response as data } from '@kitman/modules/src/UserMovement/shared/redux/services/mocks/data/mock_search_movement_organisation_list';

import useCreateMovement from '../useCreateMovement';

jest.mock('@kitman/components/src/DelayedLoadingFeedback');
jest.mock(
  '@kitman/modules/src/LeagueOperations/shared/redux/api/registrationGlobalApi'
);
jest.mock('@kitman/modules/src/UserMovement/shared/redux/services');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = {
  registrationApi: {},
  'UserMovement.services': {},
  userMovementDrawerSlice: {
    profile: null,
  },
};

const store = storeFake(defaultStore);

const renderTestComponent = () => {
  return ({ children }) => <Provider store={store}>{children}</Provider>;
};

describe('useCreateMovement', () => {
  describe('[INITIAL STATE]', () => {
    beforeEach(() => {
      useFetchAthleteQuery.mockReturnValue({
        isLoading: true,
        isError: false,
        isSuccess: false,
        data: {},
      });
      useSearchMovementOrganisationsListQuery.mockReturnValue({
        isLoading: true,
        isError: false,
        isSuccess: false,
        data: [],
      });
      usePostMovementRecordMutation.mockReturnValue([
        jest.fn(),
        { isLoading: true, isError: false, data: {} },
      ]);
    });
    let renderHookResult;

    it('has inital data', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useCreateMovement({ id: 123 }), {
          wrapper: renderTestComponent(null),
        }).result;
      });
      expect(renderHookResult.current).toHaveProperty('isLoading');
      expect(renderHookResult.current).toHaveProperty('hasFailed');
      expect(renderHookResult.current).toHaveProperty('isFetching');
      expect(renderHookResult.current).toHaveProperty('organisationData');
      expect(renderHookResult.current).toHaveProperty('onCreateMovementRecord');
      expect(renderHookResult.current.isLoading).toEqual(true);
      expect(renderHookResult.current.hasFailed).toEqual(false);
      expect(renderHookResult.current.isFetching).toEqual(false);
      expect(renderHookResult.current.organisationData).toEqual([]);
    });
  });

  describe('[FETCHING STATE]', () => {
    beforeEach(() => {
      useFetchAthleteQuery.mockReturnValue({
        isLoading: false,
        isError: false,
        isFetching: true,
        data: {},
      });
      useSearchMovementOrganisationsListQuery.mockReturnValue({
        isLoading: false,
        isError: false,
        isFetching: true,
        data: [],
      });
      usePostMovementRecordMutation.mockReturnValue([
        jest.fn(),
        { isLoading: false, isError: false, data: {} },
      ]);
    });
    let renderHookResult;

    it('has inital data', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useCreateMovement({ id: 123 }), {
          wrapper: renderTestComponent(null),
        }).result;
      });
      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.hasFailed).toEqual(false);
      expect(renderHookResult.current.isFetching).toEqual(true);
      expect(renderHookResult.current.organisationData).toEqual([]);
    });
  });

  describe('[SUCCESS STATE]', () => {
    let renderHookResult;
    beforeEach(() => {
      useFetchAthleteQuery.mockReturnValue({
        isLoading: false,
        isError: false,
        isFetching: false,
        data: {},
      });
      useSearchMovementOrganisationsListQuery.mockReturnValue({
        isLoading: false,
        isError: false,
        isFetching: false,
        data,
      });
      usePostMovementRecordMutation.mockReturnValue([
        jest.fn(),
        { isLoading: false, isError: false, data: {} },
      ]);
    });
    it('has inital data', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useCreateMovement({ id: 123 }), {
          wrapper: renderTestComponent(),
        }).result;
      });
      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.hasFailed).toEqual(false);
      expect(renderHookResult.current.isFetching).toEqual(false);
      expect(renderHookResult.current.organisationData).toStrictEqual(data);
    });
  });

  describe('[FAILURE STATE]', () => {
    let renderHookResult;
    beforeEach(() => {
      useFetchAthleteQuery.mockReturnValue({
        isLoading: false,
        isError: true,
        isFetching: false,
        data: {},
      });
      useSearchMovementOrganisationsListQuery.mockReturnValue({
        isLoading: false,
        isError: true,
        isFetching: false,
        data: [],
      });
      usePostMovementRecordMutation.mockReturnValue([
        jest.fn(),
        { isLoading: false, isError: false, data: {} },
      ]);
    });
    it('has inital data', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useCreateMovement({ id: 123 }), {
          wrapper: renderTestComponent(),
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.hasFailed).toEqual(true);
      expect(renderHookResult.current.isFetching).toEqual(false);
      expect(renderHookResult.current.organisationData).toEqual([]);
    });
  });
});
