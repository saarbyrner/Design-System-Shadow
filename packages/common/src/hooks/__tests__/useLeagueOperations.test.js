import { Provider } from 'react-redux';
import { renderHook } from '@testing-library/react-hooks';
import {
  useGetOrganisationQuery,
  useGetCurrentUserQuery,
  useGetActiveSquadQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import useLeagueOperations from '../useLeagueOperations';

jest.mock('@kitman/common/src/redux/global/services/globalApi');

const storeFake = (state) => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => ({ ...state }),
});

const defaultStore = storeFake({
  globalApi: {
    useGetOrganisationQuery: jest.fn(),
    useGetCurrentUserQuery: jest.fn(),
    useGetActiveSquadQuery: jest.fn(),
  },
});

const wrapper = ({ children }) => {
  return <Provider store={defaultStore}>{children}</Provider>;
};

describe('useLeagueOperations', () => {
  beforeEach(() => {
    useGetActiveSquadQuery.mockReturnValue({
      data: {
        id: 1,
        name: 'Test',
        owner_id: 1234,
      },
    });
  });

  describe('when the user type is Official', () => {
    beforeEach(() => {
      useGetOrganisationQuery.mockReturnValue({
        data: { association_admin: true },
      });

      useGetCurrentUserQuery.mockReturnValue({
        data: {
          type: 'Official',
          registration: { user_type: 'association_admin' },
        },
      });
    });

    it('returns correct values', () => {
      const result = renderHook(() => useLeagueOperations(), {
        wrapper,
      }).result;
      expect(result.current.isLeague).toEqual(false);
      expect(result.current.isOfficial).toEqual(true);
      expect(result.current.isMatchMonitor).toEqual(false);
      expect(result.current.isAssociationAdmin).toEqual(true);
      expect(result.current.isScout).toEqual(false);
      expect(result.current.isLeagueStaffUser).toEqual(true);
    });
  });

  describe('when the user type is a Match Director', () => {
    beforeEach(() => {
      useGetOrganisationQuery.mockReturnValue({
        data: { association_admin: true },
      });

      useGetCurrentUserQuery.mockReturnValue({
        data: {
          type: 'MatchDirector',
        },
      });
    });

    it('returns correct values', () => {
      const result = renderHook(() => useLeagueOperations(), {
        wrapper,
      }).result;
      expect(result.current.isLeague).toEqual(false);
      expect(result.current.isOfficial).toEqual(false);
      expect(result.current.isMatchDirector).toEqual(true);
      expect(result.current.isMatchMonitor).toEqual(false);
      expect(result.current.isAssociationAdmin).toEqual(true);
      expect(result.current.isScout).toEqual(false);
      expect(result.current.isLeagueStaffUser).toEqual(true);
    });
  });

  describe('when the user type is a Match Monitor', () => {
    beforeEach(() => {
      useGetOrganisationQuery.mockReturnValue({
        data: { association_admin: false },
      });

      useGetCurrentUserQuery.mockReturnValue({
        data: {
          type: 'MatchMonitor',
        },
      });
    });

    it('returns correct values', () => {
      const result = renderHook(() => useLeagueOperations(), {
        wrapper,
      }).result;
      expect(result.current.isLeague).toEqual(false);
      expect(result.current.isOfficial).toEqual(false);
      expect(result.current.isMatchDirector).toEqual(false);
      expect(result.current.isMatchMonitor).toEqual(true);
      expect(result.current.isAssociationAdmin).toEqual(false);
      expect(result.current.isScout).toEqual(false);
      expect(result.current.isLeagueStaffUser).toEqual(true);
    });
  });

  describe('when the user type is an administration admin', () => {
    beforeEach(() => {
      useGetOrganisationQuery.mockReturnValue({
        data: { association_admin: true },
      });

      useGetCurrentUserQuery.mockReturnValue({
        data: {
          type: 'User',
          role: 'Account Admin',
        },
      });
    });

    it('returns correct values', () => {
      const result = renderHook(() => useLeagueOperations(), {
        wrapper,
      }).result;
      expect(result.current.isLeague).toEqual(true);
      expect(result.current.isOfficial).toEqual(false);
      expect(result.current.isMatchMonitor).toEqual(false);
      expect(result.current.isMatchDirector).toEqual(false);
      expect(result.current.isAssociationAdmin).toEqual(true);
      expect(result.current.isScout).toEqual(false);
      expect(result.current.isLeagueStaffUser).toEqual(true);
    });
  });

  describe('when the organisation is supervised', () => {
    beforeEach(() => {
      useGetOrganisationQuery.mockReturnValue({
        data: { supervised_by: 1 },
      });

      useGetCurrentUserQuery.mockReturnValue({});
    });

    it('returns correct values', () => {
      const result = renderHook(() => useLeagueOperations(), {
        wrapper,
      }).result;
      expect(result.current.isOrgSupervised).toEqual(true);
    });
  });

  describe('when the registration is required', () => {
    beforeEach(() => {
      useGetOrganisationQuery.mockReturnValue({});

      useGetCurrentUserQuery.mockReturnValue({
        data: { registration: { required: true } },
      });
    });

    it('returns correct values', () => {
      const result = renderHook(() => useLeagueOperations(), {
        wrapper,
      }).result;
      expect(result.current.isRegistrationRequired).toEqual(true);
    });
  });

  describe('when the user type is Scout', () => {
    beforeEach(() => {
      useGetCurrentUserQuery.mockReturnValue({
        data: {
          type: 'Scout',
        },
      });
    });

    it('returns correct values', () => {
      const result = renderHook(() => useLeagueOperations(), {
        wrapper,
      }).result;

      expect(result.current.isScout).toEqual(true);
      expect(result.current.isLeagueStaffUser).toEqual(true);
    });
  });

  describe('when the organisation type is login_organisation', () => {
    beforeEach(() => {
      useGetOrganisationQuery.mockReturnValue({
        data: { organisation_type: 'login_organisation' },
      });
    });

    it('returns correct values', () => {
      const result = renderHook(() => useLeagueOperations(), {
        wrapper,
      }).result;

      expect(result.current.isLoginOrganisation).toEqual(true);
    });
  });

  describe('when active squad is required', () => {
    beforeEach(() => {
      useGetCurrentUserQuery.mockReturnValue({
        data: {
          type: 'User',
          registration: { user_type: 'association_admin' },
        },
      });
    });
    it('returns correct values', () => {
      useGetOrganisationQuery.mockReturnValue({
        data: { association_admin: false },
      });

      const result = renderHook(() => useLeagueOperations(), {
        wrapper,
      }).result;

      expect(result.current.activeSquad).toEqual({
        id: 1,
        name: 'Test',
        owner_id: 1234,
      });
    });
  });
});
