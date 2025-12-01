import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import useListStaffProfilesStructure from '@kitman/modules/src/ManageStaff/hooks/useListStaffProfilesStructure';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';

jest.mock('@kitman/common/src/redux/global/hooks/useGlobal');
jest.mock('@kitman/common/src/redux/global/services/globalApi');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  global: {
    useGlobal: jest.fn(),
    useGetOrganisationQuery: jest.fn(),
    useGetPermissionsQuery: jest.fn(),
  },
});

const wrapper = ({ children }) => (
  <Provider store={defaultStore}>{children}</Provider>
);

describe('useListStaffProfilesStructure', () => {
  let renderHookResult;

  describe('Loading tests', () => {
    it('returns isLoading false', async () => {
      useGlobal.mockReturnValue({
        isLoading: false,
        hasFailed: false,
        isSuccess: true,
      });
      useGetOrganisationQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      useGetPermissionsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useListStaffProfilesStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.hasFailed).toEqual(false);
      expect(renderHookResult.current.isSuccess).toEqual(true);
    });

    it('returns organisation isLoading', async () => {
      useGlobal.mockReturnValue({
        isLoading: true,
        hasFailed: false,
        isSuccess: false,
      });
      useGetOrganisationQuery.mockReturnValue({
        data: {},
        isLoading: true,
        isError: false,
        isSuccess: false,
      });
      useGetPermissionsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useListStaffProfilesStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(true);
      expect(renderHookResult.current.hasFailed).toEqual(false);
      expect(renderHookResult.current.isSuccess).toEqual(false);
    });

    it('returns permission isLoading', async () => {
      useGlobal.mockReturnValue({
        isLoading: true,
        hasFailed: false,
        isSuccess: false,
      });
      useGetOrganisationQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      useGetPermissionsQuery.mockReturnValue({
        data: {},
        isLoading: true,
        isError: false,
        isSuccess: false,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useListStaffProfilesStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(true);
      expect(renderHookResult.current.hasFailed).toEqual(false);
      expect(renderHookResult.current.isSuccess).toEqual(false);
    });

    it('returns all still isLoading', async () => {
      useGlobal.mockReturnValue({
        isLoading: true,
        hasFailed: false,
        isSuccess: false,
      });
      useGetOrganisationQuery.mockReturnValue({
        data: {},
        isLoading: true,
        isError: false,
        isSuccess: false,
      });
      useGetPermissionsQuery.mockReturnValue({
        data: {},
        isLoading: true,
        isError: false,
        isSuccess: false,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useListStaffProfilesStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(true);
      expect(renderHookResult.current.hasFailed).toEqual(false);
      expect(renderHookResult.current.isSuccess).toEqual(false);
    });
  });

  describe('Failure tests', () => {
    it('returns permission isError', async () => {
      useGlobal.mockReturnValue({
        isLoading: false,
        hasFailed: true,
        isSuccess: false,
      });
      useGetOrganisationQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      useGetPermissionsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: true,
        isSuccess: false,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useListStaffProfilesStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.hasFailed).toEqual(true);
      expect(renderHookResult.current.isSuccess).toEqual(false);
    });

    it('returns organisation isError', async () => {
      useGlobal.mockReturnValue({
        isLoading: false,
        hasFailed: true,
        isSuccess: false,
      });
      useGetOrganisationQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: true,
        isSuccess: true,
      });
      useGetPermissionsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useListStaffProfilesStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.hasFailed).toEqual(true);
      expect(renderHookResult.current.isSuccess).toEqual(false);
    });

    it('returns both isError', async () => {
      useGlobal.mockReturnValue({
        isLoading: false,
        hasFailed: true,
        isSuccess: false,
      });
      useGetOrganisationQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: true,
        isSuccess: false,
      });
      useGetPermissionsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: true,
        isSuccess: false,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useListStaffProfilesStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.hasFailed).toEqual(true);
      expect(renderHookResult.current.isSuccess).toEqual(false);
    });
  });
});
