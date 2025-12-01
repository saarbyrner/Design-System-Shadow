// @flow
import moment from 'moment-timezone';
import { isPositiveIntNumber } from '@kitman/common/src/utils/inputValidation';
import validateCommon from './validateCommon';
import validateEventConditions from './validateEventConditions';
import validateOrgCustomFields from './validateOrgCustomFields';

import type {
  EventGameFormData,
  EventGameFormValidity,
  EventFormValidityResult,
} from '../types';

export const allValidGame: EventGameFormValidity = {
  type: 'game_event',
};

// checkIfScoresAreValid is used to check the validity of the inputted score depending on the date.
// 1). If the date is the current date, scores are optional but if entered value must be a positive number.
// 2). If the date is in the future, the score fields will be blanked out therefore the value isn't mandatory
// 3). If the date is in the past, the score is mandatory and must be a positive number.
const checkIfScoresAreValid = (
  formData: EventGameFormData,
  startDate: moment.Moment
) => {
  const dateTz = moment.tz(moment(), formData.local_timezone);
  const isAfterYesterday = startDate.isSameOrAfter(dateTz.startOf('day'));
  const isCurrentDate = startDate.isSame(dateTz, 'day');
  const score = formData.score;
  const opponentScore = formData.opponent_score;

  if (isCurrentDate) {
    return {
      validScore:
        (window.featureFlags['game-score-for-today-allowed'] && !score) ||
        isPositiveIntNumber(score),
      validOpponentScore:
        (window.featureFlags['game-score-for-today-allowed'] &&
          !opponentScore) ||
        isPositiveIntNumber(opponentScore),
    };
  }
  if (isAfterYesterday) {
    return {
      validScore: score == null,
      validOpponentScore: opponentScore == null,
    };
  }
  // Otherwise date must be in the past, and scores are required
  return {
    validScore: isPositiveIntNumber(score),
    validOpponentScore: isPositiveIntNumber(opponentScore),
  };
};

const validateGame = (
  formData: EventGameFormData,
  seasonMarkerRange: ?Array<string>,
  temperatureUnits: ?string,
  isGameDetailsV2?: boolean,
  isCustomPeriodDuration?: boolean,
  manualOppositionNameAllowed?: boolean
): EventFormValidityResult => {
  const startDate: moment.Moment = moment.tz(
    formData.start_time,
    formData.local_timezone
  );
  let isInSeasonEvent = false;

  const scoresValidity = checkIfScoresAreValid(formData, startDate);

  if (seasonMarkerRange) {
    const startOfSeasonMarker = seasonMarkerRange[0];
    const endOfSeasonMarker = seasonMarkerRange[1];

    isInSeasonEvent =
      startDate.isSameOrAfter(moment(startOfSeasonMarker).startOf('day')) &&
      startDate.isSameOrBefore(moment(endOfSeasonMarker).endOf('day'));
  }
  const getTeamValidation = isGameDetailsV2
    ? {}
    : {
        organisation_team_id: {
          isInvalid: formData.organisation_team_id == null,
        },
      };

  // run validation for surface_type from premier league fas_game_key
  const getSurfaceTypeValidation = {};
  if (
    (isGameDetailsV2 &&
      formData?.fas_game_key &&
      formData.surface_type === undefined) ||
    null
  ) {
    getSurfaceTypeValidation.surface_type = {
      isInvalid: true,
    };
  }

  // run validation for custom_periods if the periods exist
  const getCustomPeriodsValidation = {};
  if (
    isCustomPeriodDuration &&
    !!formData.custom_periods.find((period) => !period.duration)
  )
    getCustomPeriodsValidation.custom_periods = { isInvalid: true };

  // run validation for custom_opposition_name if the custom option has been selected
  const getCustomOppositionNameValidation = {};
  if (
    manualOppositionNameAllowed &&
    (formData.team_id === -1 ||
      (formData.team_id === formData?.opponent_team?.id &&
        formData?.opponent_team?.custom)) &&
    !formData.custom_opposition_name
  )
    getCustomOppositionNameValidation.custom_opposition_name = {
      isInvalid: true,
    };

  const validationResults = {
    ...validateCommon(formData, isInSeasonEvent),
    ...validateEventConditions(formData, temperatureUnits),
    ...validateOrgCustomFields(formData),
    ...getTeamValidation,
    ...getSurfaceTypeValidation,
    ...getCustomPeriodsValidation,
    ...getCustomOppositionNameValidation,

    venue_type_id: {
      isInvalid: formData.venue_type_id == null,
    },

    competition_id: {
      isInvalid: formData.competition_id == null,
    },

    team_id: {
      isInvalid: formData.team_id == null,
    },

    score: {
      isInvalid: !scoresValidity.validScore,
    },

    opponent_score: {
      isInvalid: !scoresValidity.validOpponentScore,
    },

    round_number: {
      isInvalid:
        !!formData.round_number && !isPositiveIntNumber(formData.round_number),
    },

    turnaround_fixture: {
      isInvalid: formData.turnaround_fixture == null,
    },

    // Optional fields that currently don't require validation:
    // turnaround_prefix
  };

  let isValid = true;
  Object.values(validationResults).forEach((result) => {
    // $FlowIgnore[incompatible-type] isInvalid will be present
    if (result.isInvalid) {
      isValid = false;
    }
  });

  return {
    isValid,
    validation: {
      ...validationResults,
      type: 'game_event',
    },
  };
};

export default validateGame;
