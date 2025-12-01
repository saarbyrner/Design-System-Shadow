import { renderHook, act } from '@testing-library/react-hooks';
import { Provider } from 'react-redux';
import useStaffProfileStructure from '@kitman/modules/src/StaffProfile/shared/hooks/useStaffProfileStructure';
import {
  useGetOrganisationQuery,
  useGetPermissionsQuery,
  useGetCurrentUserQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import useLocationPathname from '@kitman/common/src/hooks/useLocationPathname';
import { useFetchStaffProfileQuery } from '@kitman/modules/src/StaffProfile/shared/redux/services';
import { useFetchPermissionsDetailsQuery } from '@kitman/services/src/services/permissions';
import useGlobal from '@kitman/common/src/redux/global/hooks/useGlobal';

jest.mock('@kitman/common/src/redux/global/hooks/useGlobal');
jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock('@kitman/modules/src/StaffProfile/shared/redux/services');
jest.mock('@kitman/services/src/services/permissions');
jest.mock('@kitman/common/src/hooks/useLocationPathname', () => jest.fn());

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
    useFetchStaffProfileQuery: jest.fn(),
    useFetchPermissionsDetailsQuery: jest.fn(),
  },
  globalApi: {
    useGetCurrentUserQuery: jest.fn(),
  },
});

const wrapper = ({ children }) => (
  <Provider store={defaultStore}>{children}</Provider>
);

describe('useStaffProfileStructure', () => {
  let renderHookResult;
  const userId = 161701;

  beforeEach(() => {
    useLocationPathname.mockImplementation(() => `/administration/staff/1234`);

    useGetCurrentUserQuery.mockReturnValue({
      data: {
        id: userId,
        firstname: 'Juan',
        lastname: 'Gumy-admin-eu',
        fullname: 'Juan Gumy-admin-eu',
        email: 'jgumy@kitmanlabs.com',
        registration: {},
        type: null,
        role: 'Account Admin',
        is_athlete: false,
      },
    });
  });
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
      useFetchStaffProfileQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      useFetchPermissionsDetailsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
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
      useFetchStaffProfileQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      useFetchPermissionsDetailsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
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
      useFetchStaffProfileQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      useFetchPermissionsDetailsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(true);
      expect(renderHookResult.current.hasFailed).toEqual(false);
      expect(renderHookResult.current.isSuccess).toEqual(false);
    });

    it('returns fetch staff profile isLoading', async () => {
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
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      useFetchStaffProfileQuery.mockReturnValue({
        data: {},
        isLoading: true,
        isError: false,
        isSuccess: false,
      });
      useFetchPermissionsDetailsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(true);
      expect(renderHookResult.current.hasFailed).toEqual(false);
      expect(renderHookResult.current.isSuccess).toEqual(false);
    });

    it('returns fetch permission tab data isLoading', async () => {
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
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      useFetchStaffProfileQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      useFetchPermissionsDetailsQuery.mockReturnValue({
        data: {},
        isLoading: true,
        isError: false,
        isSuccess: false,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
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
      useFetchStaffProfileQuery.mockReturnValue({
        data: {},
        isLoading: true,
        isError: false,
        isSuccess: false,
      });
      useFetchPermissionsDetailsQuery.mockReturnValue({
        data: {},
        isLoading: true,
        isError: false,
        isSuccess: false,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
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
      useFetchStaffProfileQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      useFetchPermissionsDetailsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
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
        isSuccess: false,
      });
      useGetPermissionsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      useFetchStaffProfileQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.hasFailed).toEqual(true);
      expect(renderHookResult.current.isSuccess).toEqual(false);
    });

    it('returns fetch staff profile isError', async () => {
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
        isError: false,
        isSuccess: true,
      });
      useFetchStaffProfileQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: true,
        isSuccess: false,
      });
      useFetchPermissionsDetailsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.hasFailed).toEqual(true);
      expect(renderHookResult.current.isSuccess).toEqual(false);
    });

    it('returns fetch permissions tab data isError', async () => {
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
        isError: false,
        isSuccess: true,
      });
      useFetchStaffProfileQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      useFetchPermissionsDetailsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: true,
        isSuccess: false,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.hasFailed).toEqual(true);
      expect(renderHookResult.current.isSuccess).toEqual(false);
    });

    it('returns all isError', async () => {
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
      useFetchStaffProfileQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: true,
        isSuccess: false,
      });
      useFetchPermissionsDetailsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: true,
        isSuccess: false,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.hasFailed).toEqual(true);
      expect(renderHookResult.current.isSuccess).toEqual(false);
    });
  });

  describe('Success tests', () => {
    it('returns success true', async () => {
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
      useFetchStaffProfileQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      useFetchPermissionsDetailsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.hasFailed).toEqual(false);
      expect(renderHookResult.current.isSuccess).toEqual(true);
    });

    it('returns success fail - 1 failed', async () => {
      useGlobal.mockReturnValue({
        isLoading: false,
        hasFailed: false,
        isSuccess: false,
      });
      useGetOrganisationQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: false,
      });
      useGetPermissionsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      useFetchStaffProfileQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      useFetchPermissionsDetailsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.hasFailed).toEqual(false);
      expect(renderHookResult.current.isSuccess).toEqual(false);
    });

    it('returns success fail - 2 failed', async () => {
      useGlobal.mockReturnValue({
        isLoading: false,
        hasFailed: false,
        isSuccess: false,
      });
      useGetOrganisationQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: false,
      });
      useGetPermissionsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: false,
      });
      useFetchStaffProfileQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });
      useFetchPermissionsDetailsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.hasFailed).toEqual(false);
      expect(renderHookResult.current.isSuccess).toEqual(false);
    });

    it('returns success fail - 3 failed', async () => {
      useGlobal.mockReturnValue({
        isLoading: false,
        hasFailed: false,
        isSuccess: false,
      });
      useGetOrganisationQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: false,
      });
      useGetPermissionsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: false,
      });
      useFetchStaffProfileQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: false,
      });
      useFetchPermissionsDetailsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: true,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.hasFailed).toEqual(false);
      expect(renderHookResult.current.isSuccess).toEqual(false);
    });

    it('returns success fail - all failed', async () => {
      useGlobal.mockReturnValue({
        isLoading: false,
        hasFailed: false,
        isSuccess: false,
      });
      useGetOrganisationQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: false,
      });
      useGetPermissionsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: false,
      });
      useFetchStaffProfileQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: false,
      });
      useFetchPermissionsDetailsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: false,
      });

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isLoading).toEqual(false);
      expect(renderHookResult.current.hasFailed).toEqual(false);
      expect(renderHookResult.current.isSuccess).toEqual(false);
    });
  });

  describe('isUserEditingOwnPermissions', () => {
    beforeEach(() => {
      useGlobal.mockReturnValue({
        isLoading: false,
        hasFailed: false,
        isSuccess: false,
      });
      useGetOrganisationQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: false,
      });
      useGetPermissionsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: false,
      });
      useFetchStaffProfileQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: false,
      });
      useFetchPermissionsDetailsQuery.mockReturnValue({
        data: {},
        isLoading: false,
        isError: false,
        isSuccess: false,
      });
    });

    it('returns true if user is editing its own permissions', async () => {
      useLocationPathname.mockImplementation(
        () => `/administration/staff/${userId}`
      );

      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isUserEditingOwnPermissions).toEqual(
        true
      );
    });

    it('returns false if user is not editing its own permissions', async () => {
      await act(async () => {
        renderHookResult = renderHook(() => useStaffProfileStructure(), {
          wrapper,
        }).result;
      });

      expect(renderHookResult.current.isUserEditingOwnPermissions).toEqual(
        false
      );
    });
  });
});
