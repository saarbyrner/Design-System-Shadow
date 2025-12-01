import moment from 'moment-timezone';
import { i18nextTranslateStub } from '@kitman/common/src/utils/test_utils';
import { playerTypesEnumLike } from '@kitman/modules/src/KitMatrix/shared/constants';
import {
  getTranslations,
  calculateTimeLeft,
  getKitsByRole,
  getHasDuplicateOfficials,
  reorderRoles,
  transformGameContacts,
  transformContactRoles,
  checkIsKickTimeSameOrBeforeDateTime,
} from '../utils';

describe('utils', () => {
  const t = i18nextTranslateStub();
  const textEnum = getTranslations(t);

  describe('getTranslations', () => {
    it('returns the right enum text', () => {
      expect(textEnum).toEqual({
        equipmentAlt: 'equipment',
        teamFlagAlt: 'team flag',
        officialsSavedSuccess: 'Game officials saved.',
        officialsSavedError: "We couldn't save the officials for this game.",
        informationSavedError:
          "We couldn't save the information for this game.",
        informationSavedSuccess: 'Game information saved.',
        assignKitSuccess: 'Kit saved.',
        assignKitError: "We couldn't save your change.",
        duplicateOfficialsErrorText:
          "Officials can't be assigned to multiple roles",
        createLeagueFixtureSuccess: 'New fixture created',
        createLeagueFixtureError: "We couldn't create a new fixture.",
        gamedayRolesSavedSuccess: 'Matchday roles saved.',
        gamedayRolesSavedError: "We couldn't save the roles for this game.",
        updateLeagueFixtureSuccess: 'Fixture updated',
        updateLeagueFixtureError: "We couldn't update the fixture.",
        canNotBeBeforeStartTime: 'Cannot be before game start.',
      });
    });
  });

  describe('calculateTimeLeft', () => {
    it('returns the correct time difference when the date is within countdown range', () => {
      Date.now = jest.fn(() => new Date('2020-05-13T12:33:37.000Z'));
      const targetDate = moment().add(1, 'hours').add(35, 'minutes');

      const result = calculateTimeLeft(targetDate);
      expect(result).not.toEqual('99:59');
      expect(result).not.toEqual('00:00');
      expect(result).toEqual('95:00');
    });

    it('returns the correct time difference when the date is outside of countdown range in the future', () => {
      const targetDate = moment()
        .add(1, 'hours')
        .add(45, 'minutes')
        .add(45, 'seconds');
      const result = calculateTimeLeft(targetDate);
      expect(result).toEqual('99:59');
    });

    it('returns 00:00:00 when the date is in the past', () => {
      const result = calculateTimeLeft(moment().subtract(1, 'hours'));
      expect(result).toEqual('00:00');
    });

    it('returns 00:00:00 when the date is now', () => {
      const result = calculateTimeLeft(moment());
      expect(result).toEqual('00:00');
    });
  });

  describe('getKitsByRole', () => {
    const event = {
      squad: {
        owner_id: 'squad1',
      },
      opponent_squad: {
        owner_id: 'squad2',
      },
      venue_type: {
        name: 'Home',
      },
    };

    it('should return players and goalkeepers for home and away team', () => {
      const result = getKitsByRole({
        event,
        kits: [
          { organisation: { id: 'squad1' }, type: playerTypesEnumLike.player },
          {
            organisation: { id: 'squad1' },
            type: playerTypesEnumLike.goalkeeper,
          },
          { organisation: { id: 'squad2' }, type: playerTypesEnumLike.player },
          {
            organisation: { id: 'squad2' },
            type: playerTypesEnumLike.goalkeeper,
          },
          { organisation: { id: 'squad3' }, type: playerTypesEnumLike.referee },
        ],
      });

      expect(result).toEqual({
        home: {
          player: [{ organisation: { id: 'squad1' }, type: 'player' }],
          goalkeeper: [{ organisation: { id: 'squad1' }, type: 'goalkeeper' }],
        },
        away: {
          player: [{ organisation: { id: 'squad2' }, type: 'player' }],
          goalkeeper: [{ organisation: { id: 'squad2' }, type: 'goalkeeper' }],
        },
        referee: [{ organisation: { id: 'squad3' }, type: 'referee' }],
      });
    });

    it('should return an empty object if no matching kits are found', () => {
      const result = getKitsByRole({ event, kits: [] });

      expect(result).toEqual({
        home: {
          player: [],
          goalkeeper: [],
        },
        away: {
          player: [],
          goalkeeper: [],
        },
        referee: [],
      });
    });
  });

  describe('getHasDuplicateOfficials', () => {
    it('returns true if the array contains duplicates', () => {
      const officialsIds = [1, 2, 3, 2];
      expect(getHasDuplicateOfficials(officialsIds)).toBe(true);
    });

    it('returns false if the array does not contain duplicates', () => {
      const officialsIds = [1, 2, 3];
      expect(getHasDuplicateOfficials(officialsIds)).toBe(false);
    });

    it('should return false for an empty array', () => {
      const officialsIds = [];
      expect(getHasDuplicateOfficials(officialsIds)).toBe(false);
    });
  });

  describe('reorderRoles', () => {
    it('returns an array of role ids reordered correctly', () => {
      const result = reorderRoles({
        order: [1, 2, 3, 4],
        orderedRoles: [],
        oldIndex: 1,
        targetIndex: 3,
      });
      expect(result).toEqual([1, 3, 4, 2]);
    });

    it('returns an array of role ids reordered correctly if order is empty', () => {
      const result = reorderRoles({
        order: [],
        orderedRoles: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        oldIndex: 0,
        targetIndex: 2,
      });
      expect(result).toEqual([2, 3, 1, 4]);
    });

    it('should handle swapping the first and last elements', () => {
      const result = reorderRoles({
        order: [1, 2, 3, 4],
        orderedRoles: [],
        oldIndex: 0,
        targetIndex: 3,
      });
      expect(result).toEqual([2, 3, 4, 1]);
    });

    it("doesn't reorder when oldIndex and targetIndex are the same", () => {
      const result = reorderRoles({
        order: [1, 2, 3, 4],
        orderedRoles: [],
        oldIndex: 2,
        targetIndex: 2,
      });
      expect(result).toEqual([1, 2, 3, 4]);
    });
  });

  describe('transformGameContacts', () => {
    it('parses gameContacts correctly', () => {
      const gameContacts = [
        {
          id: 1,
          name: 'Alice Johnson',
          email: 'alice@example.com',
          phone_number: '123-456-7890',
          game_contact_roles: [{ id: 1 }],
          organisation_id: 1,
        },
        {
          id: 2,
          name: 'Bob Smith',
          email: 'bob@example.com',
          phone_number: '098-765-4321',
          game_contact_roles: [{ id: 2 }, { id: 3 }],
          organisation_id: 1,
        },
      ];

      const expected = [
        {
          value: 1,
          label: 'Alice Johnson',
          email: 'alice@example.com',
          phone: '123-456-7890',
          roleIds: [1],
          organisationId: 1,
        },
        {
          value: 2,
          label: 'Bob Smith',
          email: 'bob@example.com',
          phone: '098-765-4321',
          roleIds: [2, 3],
          organisationId: 1,
        },
      ];

      expect(transformGameContacts(gameContacts)).toEqual(expected);
    });

    it('returns an empty array', () => {
      expect(transformGameContacts([])).toEqual([]);
    });
  });

  describe('transformContactRoles', () => {
    it('transforms contactRoles correctly', () => {
      const contactRoles = [
        {
          id: 1,
          name: 'Coach',
          gameday_role: 'required',
          gameday_role_kind: 'home_contact',
          gameday_role_order: 1,
        },
        {
          id: 2,
          name: 'Assistant Coach',
          gameday_role: 'optional',
          gameday_role_kind: 'home_contact',
          gameday_role_order: 2,
        },
        {
          id: 3,
          name: 'Match Director',
          gameday_role: 'required',
          gameday_role_kind: 'league_contact',
          gameday_role_order: 3,
        },
      ];

      const eventGameContacts = [
        {
          id: 101,
          game_contact_role_id: 1,
          game_contact: {
            name: 'John Doe',
            phone_number: '123-456-7890',
            email: 'john.doe@example.com',
          },
        },
      ];

      const result = transformContactRoles({ contactRoles, eventGameContacts });

      expect(result).toEqual([
        {
          id: 1,
          role: 'Coach',
          required: true,
          kind: 'home_contact',
          order: 1,
          __reorder__: 'Coach',
          eventGameContactId: 101,
          name: 'John Doe',
          phone: '123-456-7890',
          email: 'john.doe@example.com',
        },
        {
          id: 2,
          role: 'Assistant Coach',
          required: false,
          kind: 'home_contact',
          order: 2,
          __reorder__: 'Assistant Coach',
          eventGameContactId: undefined,
          name: undefined,
          phone: undefined,
          email: undefined,
        },
        {
          id: 3,
          role: 'Match Director',
          required: true,
          kind: 'league_contact',
          order: 3,
          __reorder__: 'Match Director',
          eventGameContactId: undefined,
          name: undefined,
          phone: undefined,
          email: undefined,
        },
      ]);
    });

    it('returns an empty array', () => {
      const result = transformContactRoles({
        contactRoles: [],
        eventGameContacts: [],
      });
      expect(result).toEqual([]);
    });
  });

  describe('checkIsKickTimeSameOrBeforeDateTime', () => {
    it('should return true if date or kickTime is null/undefined', () => {
      expect(
        checkIsKickTimeSameOrBeforeDateTime({ date: null, kickTime: moment() })
      ).toBe(true);
      expect(
        checkIsKickTimeSameOrBeforeDateTime({ date: moment(), kickTime: null })
      ).toBe(true);
      expect(
        checkIsKickTimeSameOrBeforeDateTime({ date: null, kickTime: null })
      ).toBe(true);
    });

    it('should return true if kickTime is midnight (00:00)', () => {
      const date = moment('2024-01-15T10:00:00');
      const midnightKickTime = moment('2024-01-01T00:00:00');
      expect(
        checkIsKickTimeSameOrBeforeDateTime({
          date,
          kickTime: midnightKickTime,
        })
      ).toBe(true);
    });

    it('should return true if date is the same as kickDateTime', () => {
      const date = moment('2024-01-15T10:30:00');
      const kickTime = moment('2024-01-01T10:30:00');
      expect(checkIsKickTimeSameOrBeforeDateTime({ date, kickTime })).toBe(
        true
      );
    });

    it('should return true if date is before kickDateTime', () => {
      const date = moment('2024-01-15T10:00:00');
      const kickTime = moment('2024-01-01T10:30:00');
      expect(checkIsKickTimeSameOrBeforeDateTime({ date, kickTime })).toBe(
        true
      );
    });

    it('should return false if date is after kickDateTime', () => {
      const date = moment('2024-01-15T11:00:00');
      const kickTime = moment('2024-01-01T10:30:00');
      expect(checkIsKickTimeSameOrBeforeDateTime({ date, kickTime })).toBe(
        false
      );
    });
  });
});
