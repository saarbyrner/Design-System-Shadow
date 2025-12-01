// @flow
import moment from 'moment-timezone';
import i18n from '@kitman/common/src/utils/i18n';
import type { Event, Competition } from '@kitman/common/src/types/Event';
import type {
  GameActivity,
  GamePeriod,
} from '@kitman/common/src/types/GameEvent';
import type { Principle } from '@kitman/common/src/types/Principles';
import { eventTypePermaIds } from '@kitman/services/src/services/planning/getEventLocations';
import {
  dmrEventStatusProgress,
  DmrStatuses,
} from '@kitman/modules/src/PlanningEvent/src/hooks/useUpdateDmrStatus';
import { findFormationForPeriod } from './gameActivityUtils';
import { venueTypes } from '../../consts/gameEventConsts';

export const validateRpe = (value: number | string) => {
  let error = null;
  let isValid = true;
  const rpeValue = parseFloat(value);

  if (value === '' || value === undefined) {
    return { error, isValid };
  }

  if (
    window.getFlag('rpe-0-12-w-fractions') ||
    window.getFlag('rpe-0-12-w-fractions-game')
  ) {
    if (rpeValue < 1 || rpeValue > 12) {
      error = i18n.t('RPE must be between 1 and 12 (inclusive)');
      isValid = false;
    }
    if (rpeValue.toString().split('.')[1]?.length > 1) {
      error = i18n.t('RPE must have only one decimal place');
      isValid = false;
    }
  } else {
    if (rpeValue < 1 || rpeValue > 10) {
      error = i18n.t('RPE must be between 1 and 10 (inclusive)');
      isValid = false;
    }

    if (!Number.isInteger(rpeValue)) {
      error = i18n.t('RPE must be an integer');
      isValid = false;
    }
  }
  return { error, isValid };
};

// Depending on whether the optional metadata is included when creating an event
// the top value for the SlidingPanels which sit below the Tabs will be different
export const getPlanningAreaSlidingPanelTop = (event: Event) => {
  const {
    // $FlowFixMe game_day_minus property is in Event
    game_day_minus: gameDayMinus,
    // $FlowFixMe game_day_plus property is in Event
    game_day_plus: gameDayPlus,
    surface_type: surfaceType,
    surface_quality: surfaceQuality,
    weather,
    temperature,
  } = event;

  if (
    gameDayMinus ||
    gameDayPlus ||
    surfaceType ||
    surfaceQuality ||
    weather ||
    temperature
  ) {
    return 251;
  }
  return 191;
};

export const getPrincipleNameWithItems = (principle: Principle): string => {
  const categoryName =
    principle.principle_categories.length > 0
      ? `${principle.principle_categories[0].name}, `
      : '';
  const phaseName =
    principle.phases.length > 0 ? `${principle.phases[0].name}, ` : '';

  return `${principle.name} (${categoryName}${phaseName}${principle.principle_types[0].name})`;
};

export const getDmrBannerChecks = ({
  event,
  gameActivities,
  eventPeriod,
}: {
  event: Event,
  gameActivities: Array<GameActivity>,
  eventPeriod: GamePeriod,
}) => {
  const foundFormationForPeriod = findFormationForPeriod(
    gameActivities,
    eventPeriod
  );
  const minPlayersForFormat =
    +foundFormationForPeriod?.relation?.number_of_players;

  const physicianCheckEnabled =
    event.type === eventTypePermaIds.game.type &&
    !!event?.competition?.required_designation_roles?.length;

  const minNumberOfStaff =
    event.type === eventTypePermaIds.game.type
      ? event?.competition?.min_staffs
      : null;
  const minNumberOfSubs =
    event.type === eventTypePermaIds.game.type
      ? event?.competition?.min_substitutes
      : null;

  const hasPlayersBeenSelected =
    event.type === eventTypePermaIds.game.type &&
    event.dmr?.includes(DmrStatuses.players);
  const hasSubsBeenSelected =
    event.type === eventTypePermaIds.game.type &&
    event.dmr?.includes(DmrStatuses.subs);
  const hasCaptainBeenAssigned =
    event.type === eventTypePermaIds.game.type &&
    event.dmr?.includes(DmrStatuses.captain);
  const hasStaffBeenSelected =
    event.type === eventTypePermaIds.game.type &&
    event.dmr?.includes(DmrStatuses.staff);
  const hasLineupBeenCompleted =
    event.type === eventTypePermaIds.game.type &&
    event.dmr?.includes(DmrStatuses.lineup);
  const hasPhysicianBeenAssigned =
    event.type === eventTypePermaIds.game.type &&
    event.dmr?.includes(DmrStatuses.physician);

  const complianceValidationChecks = {
    playersSelected: !!hasPlayersBeenSelected,
    captainAssigned: !!hasCaptainBeenAssigned,
    lineupDone: !!hasLineupBeenCompleted,
    subsSelected: !!hasSubsBeenSelected,
    staffSelected: !!hasStaffBeenSelected,
    physicianSelected: !!hasPhysicianBeenAssigned,
  };

  const complianceCheckValues = {
    minNumberOfPlayersSelected: minPlayersForFormat,
    minNumberOfSubs,
    minNumberOfStaff,
    isPhysicianEnabled:
      event.venue_type?.name === venueTypes.home && physicianCheckEnabled,
    isCaptainEnabled:
      event.type === eventTypePermaIds.game.type &&
      !!event?.competition?.show_captain,
  };

  return {
    complianceCheckValues,
    complianceValidationChecks,
  };
};

export const checkIsDmrLocked = ({
  event,
  isDmrClubUser,
  isEditPermsPresent,
}: {
  event: Event,
  isDmrClubUser: boolean,
  isEditPermsPresent: boolean,
}) => {
  if (!isDmrClubUser) {
    return !isEditPermsPresent;
  }

  const gameType = eventTypePermaIds.game.type;
  const isDmrTimeAfterKickoff =
    event.type === gameType &&
    moment().isAfter(moment(event?.game_participants_lock_time));
  return isDmrClubUser && isDmrTimeAfterKickoff;
};

export const getTeamMatchDayCompletionStatus = ({
  competitionConfig,
  dmrStatuses,
  isHomeStatuses,
}: {
  competitionConfig?: Competition,
  dmrStatuses?: Array<string>,
  isHomeStatuses?: boolean,
}) => {
  let dmrStatusesComplete = [DmrStatuses.players, DmrStatuses.lineup];

  if (competitionConfig?.show_captain) {
    dmrStatusesComplete = [...dmrStatusesComplete, DmrStatuses.captain];
  }

  if (competitionConfig?.min_substitutes) {
    dmrStatusesComplete = [...dmrStatusesComplete, DmrStatuses.subs];
  }

  if (competitionConfig?.min_staffs) {
    dmrStatusesComplete = [...dmrStatusesComplete, DmrStatuses.staff];
  }

  if (
    isHomeStatuses &&
    !!competitionConfig?.required_designation_roles?.length
  ) {
    dmrStatusesComplete = [...dmrStatusesComplete, DmrStatuses.physician];
  }

  if (!dmrStatuses?.length) return '';

  if (dmrStatusesComplete.every((status) => dmrStatuses.includes(status)))
    return dmrEventStatusProgress.complete;

  return dmrEventStatusProgress.partial;
};
