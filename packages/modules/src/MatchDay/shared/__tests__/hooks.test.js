import * as redux from 'react-redux';
import { Provider } from 'react-redux';
import { renderHook, act } from '@testing-library/react-hooks';
import { useGetClubsQuery } from '@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi';
import { useGetOfficialUsersQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/officialsApi';
import { useGetTvChannelsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/tvChannelsApi';
import { useGetNotificationsRecipientsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/notificationsRecipientsApi';
import { useGetCompetitionsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/competitionsApi';
import { useGetEventLocationsQuery } from '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/eventLocationsApi';
import { useSearchContactsQuery } from '@kitman/modules/src/Contacts/src/redux/rtk/searchContactsApi';
import { getActiveSquad } from '@kitman/common/src/redux/global/selectors';
import {
  useGetActiveSquadQuery,
  useGetCurrentUserQuery,
  useGetOrganisationQuery,
} from '@kitman/common/src/redux/global/services/globalApi';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { transformedContactRoles as contactRoles } from '@kitman/services/src/services/contacts/getContactRoles/mock';

import searchAdditionalUsers from '@kitman/modules/src/AdditionalUsers/shared/redux/services/api/searchAdditionalUsers';
import { useNewLeagueFixtureFormData, useGamedayRoles } from '../hooks';

jest.mock('@kitman/common/src/redux/global/services/globalApi');
jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/officialsApi'
);
jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/tvChannelsApi'
);
jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/competitionsApi'
);
jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/eventLocationsApi'
);
jest.mock(
  '@kitman/modules/src/PlanningEvent/src/redux/reducers/rtk/notificationsRecipientsApi'
);
jest.mock('@kitman/modules/src/KitMatrix/src/redux/rtk/clubsApi');
jest.mock('@kitman/modules/src/Contacts/src/redux/rtk/searchContactsApi');
jest.mock('@kitman/common/src/redux/global/selectors', () => ({
  ...jest.requireActual('@kitman/common/src/redux/global/selectors'),
  getActiveSquad: jest.fn(),
}));
jest.mock(
  '@kitman/modules/src/AdditionalUsers/shared/redux/services/api/searchAdditionalUsers',
  () => jest.fn(() => Promise.resolve({ data: [] }))
);

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

const MockClubData = {
  id: 8,
  name: 'International Squad',
  owner_id: 6,
  division: [
    {
      id: 1,
      name: 'KLS',
    },
  ],
};

describe('Hooks', () => {
  describe('useNewLeagueFixtureFormData', () => {
    const mockData = {
      competitions: [{ id: 1, name: 'Premier League' }],
      clubs: [
        { id: 101, name: 'Club A' },
        { id: 102, name: 'Club B' },
      ],
      officials: [{ id: 301, fullname: 'Referee A' }],
      tvChannels: [{ id: 401, name: 'Channel A' }],
      tvContacts: [{ id: 501, name: 'User A', tv_channel_id: 1 }],
      locations: [{ id: 677, name: 'Mr Bones Wild Ride' }],
      notificationsRecipients: [{ id: 901, name: 'Recipient A' }],
    };

    beforeEach(() => {
      jest.clearAllMocks();

      getActiveSquad.mockReturnValue(() => MockClubData);
      useGetOrganisationQuery.mockReturnValue({
        data: [
          { id: 1, name: 'Club A' },
          { id: 2, name: 'Club B' },
        ],
      });
      useGetCurrentUserQuery.mockReturnValue({
        data: {
          type: 'Official',
          registration: { user_type: 'association_admin' },
        },
      });

      useGetActiveSquadQuery.mockReturnValue({
        data: {
          id: 1,
          name: 'Test',
          owner_id: 1234,
        },
      });

      useGetCompetitionsQuery.mockReturnValue({ data: mockData.competitions });
      useGetClubsQuery.mockReturnValue({ data: mockData.clubs });
      useGetOfficialUsersQuery.mockReturnValue({ data: mockData.officials });
      useGetTvChannelsQuery.mockReturnValue({ data: mockData.tvChannels });
      useGetEventLocationsQuery.mockReturnValue({ data: mockData.locations });
      useSearchContactsQuery.mockReturnValue({ data: mockData.tvContacts });
      useGetNotificationsRecipientsQuery.mockReturnValue({
        data: mockData.notificationsRecipients,
      });
      searchAdditionalUsers.mockResolvedValue({ data: [] });
    });

    it('should return formatted options for competitions, clubs, homeSquads, awaySquads, officials, and tvChannels', () => {
      const { result } = renderHook(
        () =>
          useNewLeagueFixtureFormData({
            locationSearchExpression: null,
          }),
        {
          wrapper,
        }
      );

      expect(result.current.competitions).toEqual(mockData.competitions);
      expect(result.current.clubs).toEqual(mockData.clubs);
      expect(result.current.officials).toEqual(mockData.officials);
      expect(result.current.tvChannels).toEqual(mockData.tvChannels);
      expect(result.current.locations).toEqual(mockData.locations);
      expect(result.current.tvContactsData).toEqual(mockData.tvContacts);
      expect(result.current.notificationsRecipients).toEqual(
        mockData.notificationsRecipients
      );
    });

    it('skips optional data fetches when related preferences are disabled', () => {
      renderHook(
        () =>
          useNewLeagueFixtureFormData({
            locationSearchExpression: null,
            shouldLoadOfficials: false,
            shouldLoadTvData: false,
            shouldLoadMatchDirectors: false,
            shouldLoadNotificationsRecipients: false,
          }),
        {
          wrapper,
        }
      );

      expect(useGetOfficialUsersQuery).toHaveBeenCalledWith(
        {},
        expect.objectContaining({ skip: true })
      );
      expect(useGetTvChannelsQuery).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({ skip: true })
      );
      expect(useSearchContactsQuery).toHaveBeenCalledWith(
        { paginate: false },
        expect.objectContaining({ skip: true })
      );
      expect(useGetNotificationsRecipientsQuery).toHaveBeenCalledWith(
        {},
        expect.objectContaining({ skip: true })
      );
      expect(searchAdditionalUsers).not.toHaveBeenCalled();
    });
  });

  describe('useGamedayRoles', () => {
    const t = i18nextTranslateStub();
    const mockDispatch = jest.fn();
    let useDispatchSpy;

    const fetchEventGameContacts = jest.fn();
    const eventId = 123;
    const eventGameContacts = [
      { game_contact_role_id: 1, order: 1, game_contact: { name: 'User 1' } },
    ];

    const assignedContactRoles = [...contactRoles];
    assignedContactRoles[1] = {
      ...assignedContactRoles[1],
      eventGameContactId: 1,
    };

    beforeEach(() => {
      useDispatchSpy = jest.spyOn(redux, 'useDispatch');
      useDispatchSpy.mockReturnValue(mockDispatch);
      jest.clearAllMocks();
    });

    const renderUseGamedayRolesHook = (props) => {
      return renderHook(() =>
        useGamedayRoles({
          eventId,
          t,
          contactRoles: props.contactRoles || contactRoles,
          eventGameContacts: props.eventGameContacts || eventGameContacts,
          fetchEventGameContacts,
        })
      );
    };

    it('returns the default state', () => {
      const { result } = renderUseGamedayRolesHook({});

      expect(result.current.readOnlyRoles).toEqual([
        {
          __reorder__: 'Match Director',
          id: 1,
          kind: 'league_contact',
          order: 1,
          required: true,
          role: 'Match Director',
        },
        {
          __reorder__: 'MLS Competition Contact',
          id: 2,
          kind: 'league_contact',
          order: 2,
          required: true,
          role: 'MLS Competition Contact',
        },
      ]);
      expect(result.current.editOnlyRoles).toEqual([
        {
          __reorder__: 'Match Director',
          id: 1,
          kind: 'league_contact',
          order: 1,
          required: true,
          role: 'Match Director',
        },
        {
          __reorder__: 'MLS Competition Contact',
          id: 2,
          kind: 'league_contact',
          order: 2,
          required: true,
          role: 'MLS Competition Contact',
        },
      ]);
      expect(result.current.optionalRoles).toEqual([
        {
          id: 3,
          role: 'MLS Operations Contact',
          __reorder__: 'MLS Operations Contact',
          required: false,
          kind: 'league_contact',
          order: 3,
        },
        {
          id: 4,
          role: 'Home Team Contact',
          __reorder__: 'Home Team Contact',
          required: false,
          kind: 'home_contact',
          order: 4,
        },
      ]);
      expect(result.current.requiredRoles).toEqual([
        {
          id: 1,
          role: 'Match Director',
          __reorder__: 'Match Director',
          required: true,
          kind: 'league_contact',
          order: 1,
        },
        {
          id: 2,
          role: 'MLS Competition Contact',
          __reorder__: 'MLS Competition Contact',
          required: true,
          kind: 'league_contact',
          order: 2,
        },
      ]);
      expect(result.current.eventGameContacts).toEqual(eventGameContacts);
      expect(result.current.order).toEqual([]);
      expect(result.current.form).toEqual({});
      expect(result.current.isEditOpen).toBe(false);
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.anchorEl).toBe(null);
      expect(typeof result.current.onAddOptionalRole).toBe('function');
      expect(typeof result.current.onCloseOptionalRoles).toBe('function');
      expect(typeof result.current.onOpenEditForm).toBe('function');
      expect(typeof result.current.onOpenOptionalRoles).toBe('function');
      expect(typeof result.current.onRemoveOptionalRole).toBe('function');
      expect(typeof result.current.onResetForm).toBe('function');
      expect(typeof result.current.onSubmitForm).toBe('function');
      expect(typeof result.current.setForm).toBe('function');
      expect(typeof result.current.setOrder).toBe('function');
    });

    it('updates the state when adding an optional role', () => {
      const { result } = renderUseGamedayRolesHook({});

      act(() => {
        result.current.onAddOptionalRole(contactRoles[1]);
      });

      expect(result.current.order).toEqual([1, 2]);
      expect(result.current.editOnlyRoles).toEqual([
        {
          __reorder__: 'Match Director',
          id: 1,
          kind: 'league_contact',
          order: 1,
          required: true,
          role: 'Match Director',
        },
        {
          id: 2,
          role: 'MLS Competition Contact',
          __reorder__: 'MLS Competition Contact',
          required: true,
          kind: 'league_contact',
          order: 2,
        },
      ]);
      expect(result.current.optionalRoles).toEqual([
        {
          id: 3,
          role: 'MLS Operations Contact',
          __reorder__: 'MLS Operations Contact',
          required: false,
          kind: 'league_contact',
          order: 3,
        },
        {
          id: 4,
          role: 'Home Team Contact',
          __reorder__: 'Home Team Contact',
          required: false,
          kind: 'home_contact',
          order: 4,
        },
      ]);
    });

    it('updates the state when removing an optional role', () => {
      const { result } = renderUseGamedayRolesHook({});

      act(() => {
        result.current.onAddOptionalRole(contactRoles[1]);
      });

      act(() => {
        result.current.onRemoveOptionalRole(2);
      });

      expect(result.current.order).toEqual([1]);
      expect(result.current.editOnlyRoles).toEqual([
        {
          __reorder__: 'Match Director',
          id: 1,
          kind: 'league_contact',
          order: 1,
          required: true,
          role: 'Match Director',
        },
      ]);
      expect(result.current.optionalRoles).toEqual([
        {
          id: 3,
          role: 'MLS Operations Contact',
          __reorder__: 'MLS Operations Contact',
          required: false,
          kind: 'league_contact',
          order: 3,
        },
        {
          id: 4,
          role: 'Home Team Contact',
          __reorder__: 'Home Team Contact',
          required: false,
          kind: 'home_contact',
          order: 4,
        },
      ]);
    });

    describe('with empty eventGameContacts', () => {
      it('returns the default state', () => {
        const { result } = renderUseGamedayRolesHook({ eventGameContacts: [] });

        expect(result.current.readOnlyRoles).toEqual([
          {
            id: 1,
            role: 'Match Director',
            __reorder__: 'Match Director',
            required: true,
            kind: 'league_contact',
            order: 1,
          },
          {
            id: 2,
            role: 'MLS Competition Contact',
            __reorder__: 'MLS Competition Contact',
            required: true,
            kind: 'league_contact',
            order: 2,
          },
        ]);
        expect(result.current.editOnlyRoles).toEqual([
          {
            __reorder__: 'Match Director',
            id: 1,
            kind: 'league_contact',
            order: 1,
            required: true,
            role: 'Match Director',
          },
          {
            __reorder__: 'MLS Competition Contact',
            id: 2,
            kind: 'league_contact',
            order: 2,
            required: true,
            role: 'MLS Competition Contact',
          },
        ]);
        expect(result.current.optionalRoles).toEqual([
          {
            id: 3,
            role: 'MLS Operations Contact',
            __reorder__: 'MLS Operations Contact',
            required: false,
            kind: 'league_contact',
            order: 3,
          },
          {
            id: 4,
            role: 'Home Team Contact',
            __reorder__: 'Home Team Contact',
            required: false,
            kind: 'home_contact',
            order: 4,
          },
        ]);
        expect(result.current.requiredRoles).toEqual([
          {
            id: 1,
            role: 'Match Director',
            __reorder__: 'Match Director',
            required: true,
            kind: 'league_contact',
            order: 1,
          },
          {
            id: 2,
            role: 'MLS Competition Contact',
            __reorder__: 'MLS Competition Contact',
            required: true,
            kind: 'league_contact',
            order: 2,
          },
        ]);
        expect(result.current.eventGameContacts).toEqual([]);
        expect(result.current.order).toEqual([]);
        expect(result.current.form).toEqual({});
        expect(result.current.isEditOpen).toBe(false);
        expect(result.current.isSubmitting).toBe(false);
        expect(result.current.anchorEl).toBe(null);
        expect(typeof result.current.onAddOptionalRole).toBe('function');
        expect(typeof result.current.onCloseOptionalRoles).toBe('function');
        expect(typeof result.current.onOpenEditForm).toBe('function');
        expect(typeof result.current.onOpenOptionalRoles).toBe('function');
        expect(typeof result.current.onRemoveOptionalRole).toBe('function');
        expect(typeof result.current.onResetForm).toBe('function');
        expect(typeof result.current.onSubmitForm).toBe('function');
        expect(typeof result.current.setForm).toBe('function');
        expect(typeof result.current.setOrder).toBe('function');
      });

      it('updates the state when adding an optional role', () => {
        const { result } = renderUseGamedayRolesHook({ eventGameContacts: [] });

        act(() => {
          result.current.onAddOptionalRole(contactRoles[1]);
        });

        expect(result.current.order).toEqual([1, 2]);
        expect(result.current.editOnlyRoles).toEqual([
          {
            __reorder__: 'Match Director',
            id: 1,
            kind: 'league_contact',
            order: 1,
            required: true,
            role: 'Match Director',
          },
          {
            id: 2,
            role: 'MLS Competition Contact',
            __reorder__: 'MLS Competition Contact',
            required: true,
            kind: 'league_contact',
            order: 2,
          },
        ]);
        expect(result.current.optionalRoles).toEqual([
          {
            id: 3,
            role: 'MLS Operations Contact',
            __reorder__: 'MLS Operations Contact',
            required: false,
            kind: 'league_contact',
            order: 3,
          },
          {
            id: 4,
            role: 'Home Team Contact',
            __reorder__: 'Home Team Contact',
            required: false,
            kind: 'home_contact',
            order: 4,
          },
        ]);
      });

      it('updates the state when removing an optional role', () => {
        const { result } = renderUseGamedayRolesHook({ eventGameContacts: [] });

        act(() => {
          result.current.onAddOptionalRole(contactRoles[1]);
        });

        act(() => {
          result.current.onRemoveOptionalRole(2);
        });

        expect(result.current.order).toEqual([1]);
        expect(result.current.editOnlyRoles).toEqual([
          {
            __reorder__: 'Match Director',
            id: 1,
            kind: 'league_contact',
            order: 1,
            required: true,
            role: 'Match Director',
          },
        ]);
        expect(result.current.optionalRoles).toEqual([
          {
            id: 3,
            role: 'MLS Operations Contact',
            __reorder__: 'MLS Operations Contact',
            required: false,
            kind: 'league_contact',
            order: 3,
          },
          {
            id: 4,
            role: 'Home Team Contact',
            __reorder__: 'Home Team Contact',
            required: false,
            kind: 'home_contact',
            order: 4,
          },
        ]);
      });
    });
  });
});
