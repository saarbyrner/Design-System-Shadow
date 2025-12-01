import { Provider } from 'react-redux';
import { renderHook, act } from '@testing-library/react-hooks';
import useGlobal from '../hooks/useGlobal';

import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
  useGetCurrentUserQuery,
  useGetPreferencesQuery,
  useGetActiveSquadQuery,
} from '../services/globalApi';

jest.mock('../services/globalApi');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
    useGetPreferencesQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
    useGetActiveSquadQuery: jest.fn(),
  },
});

const wrapper = ({ children }) => {
  return <Provider store={defaultStore}>{children}</Provider>;
};

describe('useGlobal', () => {
  const setUpMockQueryReturns = (isLoading, isError, isSuccess) => {
    useGetOrganisationQuery.mockReturnValue({
      data: [],
      isLoading,
      isError,
      isSuccess,
    });
    useGetCurrentUserQuery.mockReturnValue({
      data: [],
      isLoading,
      isError,
      isSuccess,
    });
    useGetPermissionsQuery.mockReturnValue({
      data: [],
      isLoading,
      isError,
      isSuccess,
    });
    useGetPreferencesQuery.mockReturnValue({
      data: {},
      isLoading,
      isError,
      isSuccess,
    });
    useGetActiveSquadQuery.mockReturnValue({
      data: {},
      isLoading,
      isError,
      isSuccess,
    });
  };

  const checkRenderHookValues = async (
    renderHookIsLoading,
    renderHookHasFailed,
    renderHookIsSuccessful
  ) => {
    let renderHookResult;
    await act(async () => {
      renderHookResult = renderHook(() => useGlobal(), { wrapper }).result;
    });
    expect(renderHookResult.current).toHaveProperty('isLoading');
    expect(renderHookResult.current.isLoading).toEqual(renderHookIsLoading);
    expect(renderHookResult.current).toHaveProperty('hasFailed');
    expect(renderHookResult.current.hasFailed).toEqual(renderHookHasFailed);
    expect(renderHookResult.current).toHaveProperty('isSuccess');
    expect(renderHookResult.current.isSuccess).toEqual(renderHookIsSuccessful);
  };
  describe('Loading state', () => {
    describe('isLoading true', () => {
      beforeEach(() => {
        setUpMockQueryReturns(true, false, false);
      });
      // eslint-disable-next-line jest/expect-expect
      it('returns true when any request isLoading', async () => {
        await checkRenderHookValues(true, false, false);
      });
    });
    describe('isLoading false', () => {
      beforeEach(() => {
        setUpMockQueryReturns(false, false, false);
      });
      // eslint-disable-next-line jest/expect-expect
      it('returns false when no request are loading', () => {
        checkRenderHookValues(false, false, false);
      });
    });
  });

  describe('Error state', () => {
    describe('hasFailed true', () => {
      beforeEach(() => {
        setUpMockQueryReturns(false, true, false);
      });
      // eslint-disable-next-line jest/expect-expect
      it('returns true if any request fails', async () => {
        checkRenderHookValues(false, true, false);
      });
    });
    describe('hasFailed false', () => {
      beforeEach(() => {
        setUpMockQueryReturns(false, false, false);
      });
      // eslint-disable-next-line jest/expect-expect
      it('returns false if no requests fail', async () => {
        checkRenderHookValues(false, false, false);
      });
    });
  });

  describe('Success state', () => {
    describe('isSuccess true', () => {
      beforeEach(() => {
        setUpMockQueryReturns(false, false, true);
      });
      // eslint-disable-next-line jest/expect-expect
      it('returns true when all requests have succeeded', async () => {
        checkRenderHookValues(false, false, true);
      });
    });

    describe('isSuccess false when on item is false', () => {
      beforeEach(() => {
        useGetOrganisationQuery.mockReturnValue({
          data: [],
          isSuccess: true,
        });
        useGetCurrentUserQuery.mockReturnValue({
          data: [],
          isSuccess: false,
        });
        useGetPermissionsQuery.mockReturnValue({
          data: [],
          isSuccess: true,
        });
        useGetPreferencesQuery.mockReturnValue({
          data: {},
          isSuccess: true,
          isError: false,
          isLoading: false,
        });
        useGetActiveSquadQuery.mockReturnValue({
          data: [],
          isSuccess: true,
        });
      });
      // eslint-disable-next-line jest/expect-expect
      it('returns false when any requests have failed', async () => {
        checkRenderHookValues(false, false, false);
      });
    });
  });
});
