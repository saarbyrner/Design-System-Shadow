// @flow
import moment from 'moment-timezone';
import type { Translation } from '@kitman/common/src/types/i18n';
import { playerTypesEnumLike } from '@kitman/modules/src/KitMatrix/shared/constants';
import { venueTypes } from '@kitman/common/src/consts/gameEventConsts';
import mock from '@kitman/modules/src/MatchDay/shared/mock';
import type {
  ContactResponse,
  ContactRole,
} from '@kitman/modules/src/Contacts/shared/types';
import type { EventGameContact } from '@kitman/services/src/services/contacts/getEventGameContacts';
import type { TextEnum, GetKitsByRoleArgs, ReorderArrayArgs } from './types';

export const getTranslations = (t: Translation): TextEnum => ({
  equipmentAlt: t('equipment'),
  teamFlagAlt: t('team flag'),
  officialsSavedSuccess: t('Game officials saved.'),
  officialsSavedError: t("We couldn't save the officials for this game."),
  informationSavedSuccess: t('Game information saved.'),
  informationSavedError: t("We couldn't save the information for this game."),
  assignKitSuccess: t('Kit saved.'),
  assignKitError: t("We couldn't save your change."),
  duplicateOfficialsErrorText: t(
    "Officials can't be assigned to multiple roles"
  ),
  createLeagueFixtureSuccess: t('New fixture created'),
  createLeagueFixtureError: t("We couldn't create a new fixture."),
  gamedayRolesSavedSuccess: t('Matchday roles saved.'),
  gamedayRolesSavedError: t("We couldn't save the roles for this game."),
  updateLeagueFixtureSuccess: t('Fixture updated'),
  updateLeagueFixtureError: t("We couldn't update the fixture."),
  canNotBeBeforeStartTime: t('Cannot be before game start.'),
});

export const calculateTimeLeft = (
  targetDate: string | Date | moment.Moment
) => {
  const now = moment();
  const target = moment(targetDate);

  if (target.isSameOrBefore(now)) {
    return '00:00';
  }

  const diff = target.diff(now);
  const duration = moment.duration(diff);

  const minutes = Math.floor(duration.asMinutes());

  if (minutes >= 100) {
    return '99:59';
  }

  const seconds = String(duration.seconds()).padStart(2, '0');

  return `${minutes}:${seconds}`;
};

export const getKitsByRole = ({ event, kits }: GetKitsByRoleArgs) => {
  const result = {
    home: {
      player: [],
      goalkeeper: [],
    },
    away: {
      player: [],
      goalkeeper: [],
    },
    referee: [],
  };

  if (!event) {
    return result;
  }

  const opponent = event.opponent_squad || event.opponent_team;
  const isHome = event.venue_type?.name === venueTypes.home;
  const homeTeam = isHome ? event.squad : opponent;

  kits.forEach((kit) => {
    const name = homeTeam?.owner_id === kit.organisation?.id ? 'home' : 'away';

    if (kit.type === playerTypesEnumLike.referee) {
      result.referee.push(kit);
    } else {
      if (kit.type === playerTypesEnumLike.player) {
        result[name].player.push(kit);
      }
      if (kit.type === playerTypesEnumLike.goalkeeper) {
        result[name].goalkeeper.push(kit);
      }
    }
  });

  return result;
};

export const getStoreForTest = ({
  timezone,
  customEvent = {},
}: {
  timezone?: string,
  customEvent?: any,
} = {}) => {
  const storeFake = (state) => ({
    default: () => {},
    subscribe: () => {},
    dispatch: () => {},
    getState: () => ({ ...state }),
  });

  const event = {
    ...mock.event,
    ...customEvent,
  };

  return storeFake({
    planningEventApi: {
      queries: [
        {
          endpointName: 'getPlanningEvent',
          data: {
            event: timezone ? { ...event, local_timezone: timezone } : event,
          },
        },
      ],
    },
    officialsApi: {
      queries: [
        {
          endpointName: 'getGameOfficials',
          data: mock.gameOfficials,
        },
      ],
    },
  });
};

export const getHasDuplicateOfficials = (officialsIds: Array<number>) => {
  return new Set(officialsIds).size !== officialsIds.length;
};

export const reorderRoles = ({
  order,
  orderedRoles,
  oldIndex,
  targetIndex,
}: ReorderArrayArgs): Array<number> => {
  const newOrder = order.length
    ? [...order]
    : orderedRoles.map((item) => item.id);

  const [movedItem] = newOrder.splice(oldIndex, 1);
  newOrder.splice(targetIndex, 0, movedItem);
  return newOrder;
};

export const transformGameContacts = (gameContacts: Array<ContactResponse>) => {
  // $FlowIgnore[missing-annot]
  return gameContacts.map((item) => ({
    value: item.id,
    label: item.name,
    email: item.email,
    phone: item.phone_number,
    roleIds: item.game_contact_roles?.map((role) => role.id),
    organisationId: item.organisation_id,
  }));
};

export const transformContactRoles = ({
  contactRoles,
  eventGameContacts,
}: {
  contactRoles: Array<ContactRole>,
  eventGameContacts: Array<EventGameContact>,
}) => {
  // $FlowIgnore[missing-annot]
  return contactRoles.map((item) => {
    const [eventGameContactFound] = eventGameContacts.filter(
      (eventGameContact) => eventGameContact.game_contact_role_id === item.id
    );

    return {
      id: item.id,
      role: item.name,
      required: item.gameday_role === 'required',
      kind: item.gameday_role_kind,
      order: item.gameday_role_order,
      // https://mui.com/x/react-data-grid/row-ordering/#customizing-the-reorder-value
      __reorder__: item.name,
      eventGameContactId: eventGameContactFound?.id,
      name: eventGameContactFound?.game_contact?.name,
      phone: eventGameContactFound?.game_contact?.phone_number,
      email: eventGameContactFound?.game_contact?.email,
    };
  });
};

export const checkIsKickTimeSameOrBeforeDateTime = ({
  date,
  kickTime,
}: {
  date: moment.Moment,
  kickTime: moment.Moment,
}) => {
  if (!date || !kickTime) {
    return true;
  }

  const isMidnightKickTime = kickTime.hour() === 0 && kickTime.minute() === 0;

  if (isMidnightKickTime) {
    return true;
  }

  const kickDateTime = date.clone().set({
    hour: kickTime.hour(),
    minute: kickTime.minute(),
  });

  return date.isSameOrBefore(kickDateTime);
};
