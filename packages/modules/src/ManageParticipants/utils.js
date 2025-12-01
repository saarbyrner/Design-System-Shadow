// @flow
import i18n from '@kitman/common/src/utils/i18n';
import type { Participant, Squad, AthletesFilter } from './types';

export const calculateWorkload = (rpe: string, duration: string) => {
  return rpe && duration
    ? Math.round(parseInt(rpe, 10) * parseInt(duration, 10))
    : 0;
};

export const getFormErrors = (participants: Array<Participant>) => {
  const errors = {};
  let isFormValid = true;

  participants.forEach((participant) => {
    errors[participant.athlete_id] = [];

    if (participant.rpe) {
      const participantRPE = parseFloat(participant.rpe);

      if (window.getFlag('rpe-0-12-w-fractions')) {
        if (participantRPE < 0 || participantRPE > 12) {
          errors[participant.athlete_id].push(
            i18n.t('RPE must be between 0 and 12 (inclusive)')
          );
          isFormValid = false;
        }
      } else {
        if (participantRPE < 0 || participantRPE > 10) {
          errors[participant.athlete_id].push(
            i18n.t('RPE must be between 0 and 10 (inclusive)')
          );
          isFormValid = false;
        }

        if (!Number.isInteger(participantRPE)) {
          errors[participant.athlete_id].push(i18n.t('RPE must be an integer'));
          isFormValid = false;
        }
      }
    }

    if (parseInt(participant.duration, 10) < 0) {
      errors[participant.athlete_id].push(
        i18n.t('Duration must be greater than or equal to 0')
      );
      isFormValid = false;
    }
  });

  return { errors, isFormValid };
};

export const getEmptyAthleteSelection = () => ({
  applies_to_squad: false,
  position_groups: [],
  positions: [],
  athletes: [],
  all_squads: false,
  squads: [],
});

export const getInitialAthleteFilters = (
  availableSquads: Array<Squad>,
  participants: Array<Participant>
): Array<AthletesFilter> =>
  availableSquads.map((squad) => ({
    squadId: squad.id,
    filteredAthletes: participants
      .filter((participant) => participant.squads.includes(squad.id))
      .map((participant) => participant.athlete_id),
  }));
