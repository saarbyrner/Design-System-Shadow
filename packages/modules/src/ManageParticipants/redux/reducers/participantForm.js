// @flow
import type { Store } from '../types/store';
import type { Action } from '../types/actions';
import type { Participant } from '../../types';

// eslint-disable-next-line func-names
export default function (
  state: $PropertyType<Store, 'participantForm'> = {},
  action: Action
) {
  switch (action.type) {
    case 'UPDATE_DURATION': {
      return {
        ...state,
        participants: state.participants.map<Participant>((participant) => {
          return participant.athlete_id === action.payload.athleteId
            ? { ...participant, duration: action.payload.duration }
            : participant;
        }),
      };
    }
    case 'UPDATE_PARTICIPATION_LEVEL': {
      const canonicalParticipationLevel =
        action.payload.participationLevel.canonical_participation_level;
      const includeInGroupCalculationByParticipationLevel =
        action.payload.participationLevel.include_in_group_calculations;
      const isPrimarySquadSelected =
        action.payload.isAthletePrimarySquadSelected;

      return {
        ...state,
        participants: state.participants.map<Participant>((participant) => {
          if (participant.athlete_id !== action.payload.athleteId) {
            return participant;
          }

          const isPrimarySquadSet = participant.primary_squad_id;

          // when participation level is anything but "not participated"
          // and participant's primary squad is the selected squad
          // or participant doesn't have a primary squad set,
          // inclusion is participation level driven
          const includeInGroupCalcByPrimarySquads =
            isPrimarySquadSelected || !isPrimarySquadSet
              ? includeInGroupCalculationByParticipationLevel
              : false;

          switch (canonicalParticipationLevel) {
            case 'none': {
              return {
                ...participant,
                participation_level_id: action.payload.participationLevel.id,
                duration: '',
                rpe: '',
                include_in_group_calculations:
                  includeInGroupCalculationByParticipationLevel,
              };
            }
            case 'full': {
              return {
                ...participant,
                participation_level_id: action.payload.participationLevel.id,
                duration: action.payload.eventDuration,
                include_in_group_calculations:
                  includeInGroupCalcByPrimarySquads,
              };
            }
            default: {
              return {
                ...participant,
                participation_level_id: action.payload.participationLevel.id,
                include_in_group_calculations:
                  includeInGroupCalcByPrimarySquads,
              };
            }
          }
        }),
      };
    }
    case 'UPDATE_RPE': {
      return {
        ...state,
        participants: state.participants.map<Participant>((participant) => {
          return participant.athlete_id === action.payload.athleteId
            ? { ...participant, rpe: action.payload.rpe }
            : participant;
        }),
      };
    }
    case 'TOGGLE_INCLUDE_IN_GROUP_CALCULATIONS': {
      return {
        ...state,
        participants: state.participants.map<Participant>((participant) => {
          return participant.athlete_id === action.payload.athleteId
            ? {
                ...participant,
                include_in_group_calculations:
                  !participant.include_in_group_calculations,
              }
            : participant;
        }),
      };
    }
    case 'UPDATE_RPE_COLLECTION_ATHLETE': {
      return {
        ...state,
        event: {
          ...state.event,
          rpe_collection_athlete: action.payload.rpeCollectionAthlete,
        },
      };
    }
    case 'UPDATE_RPE_COLLECTION_KIOSK': {
      return {
        ...state,
        event: {
          ...state.event,
          rpe_collection_kiosk: action.payload.rpeCollectionKiosk,
        },
      };
    }
    case 'UPDATE_MASS_INPUT': {
      return {
        ...state,
        event: {
          ...state.event,
          mass_input: action.payload.massInput,
        },
      };
    }
    case 'UPDATE_ALL_DURATIONS': {
      const noneParticipationLevels = action.payload.participationLevels
        .filter(
          (participationLevel) =>
            participationLevel.canonical_participation_level === 'none'
        )
        .map((participationLevel) => participationLevel.id);

      return {
        ...state,
        participants: state.participants.map<Participant>((participant) => {
          if (
            !action.payload.filteredAthletes.includes(participant.athlete_id) ||
            noneParticipationLevels.includes(participant.participation_level_id)
          ) {
            return participant;
          }

          return {
            ...participant,
            duration: action.payload.duration,
          };
        }),
      };
    }
    case 'UPDATE_ALL_PARTICIPATION_LEVELS': {
      const canonicalParticipationLevel =
        action.payload.participationLevel.canonical_participation_level;
      const includeInGroupCalculationByParticipationLevel =
        action.payload.participationLevel.include_in_group_calculations;

      return {
        ...state,
        participants: state.participants.map<Participant>((participant) => {
          if (
            !action.payload.filteredAthletes.includes(participant.athlete_id)
          ) {
            return participant;
          }

          const isPrimarySquadSet = participant.primary_squad_id;
          const isPrimarySquadSelected =
            participant.primary_squad_id === action.payload.selectedSquadId;

          // when participation level is anything but "not participated"
          // and participant's primary squad is the selected squad
          // or participant doesn't have a primary squad set,
          // inclusion is participation level driven
          const includeInGroupCalcByPrimarySquads =
            isPrimarySquadSelected || !isPrimarySquadSet
              ? includeInGroupCalculationByParticipationLevel
              : false;

          switch (canonicalParticipationLevel) {
            case 'none': {
              return {
                ...participant,
                participation_level_id: action.payload.participationLevel.id,
                duration: '',
                rpe: '',
                include_in_group_calculations:
                  includeInGroupCalculationByParticipationLevel,
              };
            }
            case 'full': {
              return {
                ...participant,
                participation_level_id: action.payload.participationLevel.id,
                duration: action.payload.eventDuration,
                include_in_group_calculations:
                  includeInGroupCalcByPrimarySquads,
              };
            }
            default: {
              return {
                ...participant,
                participation_level_id: action.payload.participationLevel.id,
                include_in_group_calculations:
                  includeInGroupCalcByPrimarySquads,
              };
            }
          }
        }),
      };
    }
    case 'TOGGLE_ALL_INCLUDE_IN_GROUP_CALCULATION': {
      return {
        ...state,
        participants: state.participants.map<Participant>((participant) => {
          const canonicalParticipationLevel =
            action.payload.participationLevels.find(
              (participationLevel) =>
                participationLevel.id === participant.participation_level_id
            )?.canonical_participation_level;

          if (
            !action.payload.filteredAthletes.includes(participant.athlete_id) ||
            canonicalParticipationLevel === 'none'
          ) {
            return participant;
          }

          return {
            ...participant,
            include_in_group_calculations:
              action.payload.includeInGroupCalculations,
          };
        }),
      };
    }
    default:
      return state;
  }
}
