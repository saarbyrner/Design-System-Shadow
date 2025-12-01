// @flow
import moment from 'moment';
import type { Athlete } from '@kitman/common/src/types/Athlete';
import type { Note } from '@kitman/common/src/types/Issues';
import type { Period } from '@kitman/services/src/services/getCurrentAssociation';
import formatActivityGroupOptions from '@kitman/common/src/utils/formatActivityGroupOptions';
import * as DateFormatter from '@kitman/common/src/utils/dateFormatter';
import type { PositionGroup } from '@kitman/services/src/services/getPositionGroups';
import type {
  Side,
  Sides,
} from '@kitman/services/src/services/medical/getSides';
import type { InjuryStatuses } from '@kitman/services/src/services/getInjuryStatuses';
import type { ActivityGroups } from '@kitman/services/src/services/medical/getActivityGroups';
import type {
  Pathologies,
  Classifications,
  BodyAreas,
  Pathology,
  Classification,
  BodyArea,
} from '@kitman/modules/src/Medical/shared/types/medical/MultiCodingV2';
import type {
  IssueOccurrence,
  Onset,
  PriorIssues,
  PriorIssue,
} from '../../types/_common';

export const getBlankNote = () => ({
  id: '',
  date: '',
  note: '',
  created_by: '',
  restricted: false,
  psych_only: false,
});

// Format issue statuses to the <dropdown /> items format
export const formatIssueStatusOptions = (
  issueStatuses: InjuryStatuses
): Array<Object> =>
  issueStatuses.map((issueStatus) => ({
    title: issueStatus.description,
    id: issueStatus.id,
    cause_unavailability: issueStatus.cause_unavailability,
    restore_availability: issueStatus.restore_availability,
    order: issueStatus.order,
  }));

// Format issue types to the <dropdown /> items format
export const formatIssueTypeOptions = (
  issueTypesOptions: Array<{ id: number, name: string }>
): Array<Object> =>
  issueTypesOptions.map((issueType) => ({
    title: issueType.name,
    id: issueType.id,
  }));

// Format osics pathologies to the <dropdown /> items format
export const formatOsicsPathologyOptions = (
  osicsPathologyOptions: Array<Pathology>
): Array<Object> =>
  osicsPathologyOptions.map((osicsPathology) => ({
    title: osicsPathology.name,
    id: osicsPathology.id,
  }));

// Format osics classifications to the <dropdown /> items format
export const formatOsicsClassificationOptions = (
  osicsClassificationOptions: Array<Classification>
): Array<Object> =>
  osicsClassificationOptions.map((osicsClassification) => ({
    title: osicsClassification.name,
    id: osicsClassification.id,
  }));

// Format body areas to the <dropdown /> items format
export const formatBodyAreaOptions = (
  bodyAreaOptions: Array<BodyArea>
): Array<Object> =>
  bodyAreaOptions.map((bodyArea) => ({
    title: bodyArea.name,
    id: bodyArea.id,
  }));

// Format sideOptions to the <dropdown /> items format
export const formatSideOptions = (sideOptions: Sides): Array<Object> =>
  sideOptions.map((side) => ({
    title: side.name,
    id: side.id,
  }));

// Format gameOptions to the <dropdown /> items format
export const formatGameOptionFromArray = (
  gameOptions: Array<Array<string>>
): Array<Object> =>
  gameOptions.map((game) => ({
    title: game[0],
    id: game[1],
  }));

// Format periodOptions to the <dropdown /> items format
export const formatPeriodOptionFromArray = (
  periodOptions: Array<Object>
): Array<Object> => {
  const options = periodOptions || [];
  return options.map((period) => ({
    title: period.name,
    id: period.id,
  }));
};

// Format position groups to the <dropdown /> items format
export const formatPositionGroupFromArray = (
  positionGroupOptions: Array<Object>
): Array<Object> => {
  const formattedPositionGroups = [];

  positionGroupOptions.forEach((group) => {
    formattedPositionGroups.push({
      isGroupOption: true,
      name: group.name,
    });

    group.positions.forEach((position) => {
      formattedPositionGroups.push({
        name: position.name,
        key_name: position.id,
      });
    });
  });

  return formattedPositionGroups;
};

// Format training sessions to the <dropdown /> items format
export const formatTrainingSessionOptionFromArray = (
  trainingSessionOptions: Array<Array<string>>
): Array<Object> =>
  trainingSessionOptions.map((trainingSession) => ({
    title: trainingSession[0],
    id: trainingSession[1],
  }));

// Format gameOptions to the <dropdown /> items format
export const formatGameOptionsFromObject = (
  gameOptions: Array<{ value: string, name: string, game_date?: string }>
): Array<Object> =>
  gameOptions.map((game) => ({
    title: game.name,
    // We use the id 'UNLISTED' on the frontend but the backend uses an empty string.
    // The backend uses an empty string because it doesn't save unlisted games.
    // We can't use an empty string id on the frontend because the game field is mandatory
    // and the frontend validation doesn't allow empty string.
    id: game.value || 'UNLISTED',
    date: game.game_date,
  }));

// Format training sessions to the <dropdown /> items format
export const formatTrainingSessionOptionsFromObject = (
  trainingSessionOptions: Array<{ value: string, name: string }>
): Array<Object> =>
  trainingSessionOptions.map((trainingSession) => ({
    title: trainingSession.name,
    // We use the id 'UNLISTED' on the frontend but the backend uses an empty string.
    // The backend uses an empty string because it doesn't save unlisted training sessions.
    // We can't use an empty string id on the frontend because the training sessions
    // field is mandatory and the frontend validation doesn't allow empty string.
    id: trainingSession.value || 'UNLISTED',
  }));

const formatRange = (startDate: moment, endDate: moment): string => {
  if (window.featureFlags['standard-date-formatting']) {
    return DateFormatter.formatRange(startDate, endDate);
  }

  return `${startDate.format('D MMM YYYY')} - ${endDate.format('D MMM YYYY')}`;
};

// Format prior issues to the <dropdown /> items format
export const formatPriorIssueOptions = (
  priorIssues: Array<PriorIssue>
): Array<Object> =>
  priorIssues.map((priorIssue) => {
    const startDate = moment(
      priorIssue.occurrence_date,
      DateFormatter.dateTransferFormat
    );
    const endDate = moment(
      priorIssue.resolved_date,
      DateFormatter.dateTransferFormat
    );
    const formattedDateRange = formatRange(startDate, endDate);

    return {
      title: priorIssue.name,
      description: `(${formattedDateRange})`,
      id: priorIssue.id,
    };
  });

export const getOsicsPathologiesOptions = (
  formType: 'INJURY' | 'ILLNESS',
  injuryOsicsPathologies: Pathologies,
  illnessOsicsPathologies: Pathologies
) => {
  const osicsPathologies =
    formType === 'INJURY' ? injuryOsicsPathologies : illnessOsicsPathologies;

  return osicsPathologies ? formatOsicsPathologyOptions(osicsPathologies) : [];
};

export const getClassificationsOptions = (
  formType: 'INJURY' | 'ILLNESS',
  injuryOsicsClassifications: Classifications,
  illnessOsicsClassifications: Classifications
) => {
  const osicsClassifications =
    formType === 'INJURY'
      ? injuryOsicsClassifications
      : illnessOsicsClassifications;

  return osicsClassifications
    ? formatOsicsClassificationOptions(osicsClassifications)
    : [];
};

export const getBodyAreaOptions = (
  formType: 'INJURY' | 'ILLNESS',
  injuryOsicsBodyAreas: BodyAreas,
  illnessOsicsBodyAreas: BodyAreas
) => {
  const osicsBodyArea =
    formType === 'INJURY' ? injuryOsicsBodyAreas : illnessOsicsBodyAreas;

  return osicsBodyArea ? formatBodyAreaOptions(osicsBodyArea) : [];
};

export const getIssueTypeOptions = (
  formType: 'INJURY' | 'ILLNESS',
  injuryOnsets: Array<Onset>,
  illnessOnsets: Array<Onset>
) => {
  const issueTypes = formType === 'INJURY' ? injuryOnsets : illnessOnsets;

  return issueTypes ? formatIssueTypeOptions(issueTypes) : [];
};

export const getModalState = (
  formMode: 'EDIT' | 'CREATE',
  formType: 'INJURY' | 'ILLNESS',
  athlete: Object,
  issueData: IssueOccurrence,
  priorIssues: PriorIssues,
  positionGroups: Array<PositionGroup>,
  sides: Array<Side>,
  injuryOsicsPathologies: Pathologies,
  illnessOsicsPathologies: Pathologies,
  injuryOsicsClassifications: Classifications,
  illnessOsicsClassifications: Classifications,
  injuryOsicsBodyAreas: BodyAreas,
  illnessOsicsBodyAreas: BodyAreas,
  associationPeriods: Array<Period>,
  associationPeriodTerm: ?string,
  injuryOnsets: Array<Onset>,
  illnessOnsets: Array<Onset>,
  activityGroups: ActivityGroups,
  injuryStatuses: InjuryStatuses
) => {
  return {
    athleteId: athlete.id,
    athleteName: athlete.full_name,
    athletePositionId: athlete.position_id,
    priorIssues,
    priorInjuryOptions:
      priorIssues && priorIssues.prior_injuries
        ? formatPriorIssueOptions(priorIssues.prior_injuries)
        : [],
    priorIllnessOptions:
      priorIssues && priorIssues.prior_illnesses
        ? formatPriorIssueOptions(priorIssues.prior_illnesses)
        : [],
    osicsPathologyOptions: getOsicsPathologiesOptions(
      formType,
      injuryOsicsPathologies,
      illnessOsicsPathologies
    ),
    osicsClassificationOptions: getClassificationsOptions(
      formType,
      injuryOsicsClassifications,
      illnessOsicsClassifications
    ),
    bodyAreaOptions: getBodyAreaOptions(
      formType,
      injuryOsicsBodyAreas,
      illnessOsicsBodyAreas
    ),
    sideOptions: sides ? formatSideOptions(sides) : [],
    issueTypeOptions: getIssueTypeOptions(
      formType,
      injuryOnsets,
      illnessOnsets
    ),
    activityGroupOptions: activityGroups
      ? formatActivityGroupOptions(activityGroups)
      : [],
    gameOptions: [],
    periodOptions: associationPeriods
      ? formatPeriodOptionFromArray(associationPeriods)
      : [],
    periodTerm: associationPeriodTerm,
    trainingSessionOptions: [],
    positionGroupOptions: positionGroups
      ? formatPositionGroupFromArray(positionGroups)
      : [],
    injuryStatusOptions: injuryStatuses
      ? formatIssueStatusOptions(injuryStatuses)
      : [],
    eventsOrder: issueData.events_order ? issueData.events_order : [],
    formMode,
    formType,
    staticData: {
      injuryOsicsPathologies,
      illnessOsicsPathologies,
      injuryOsicsClassifications,
      illnessOsicsClassifications,
      injuryOsicsBodyAreas,
      illnessOsicsBodyAreas,
      injuryOnsets,
      illnessOnsets,
    },
  };
};

export const transformIssueRequest = (
  issueData: IssueOccurrence,
  currentNote: Note,
  formType: 'INJURY' | 'ILLNESS'
) => {
  const newData = Object.assign({}, issueData);
  // Add the new note to the data sent to the server
  const newNotes = newData.notes.slice();
  if (currentNote.note.length > 0) {
    newNotes.push(currentNote);
  }

  // We use the id 'UNLISTED' on the frontend but the backend uses an empty string instead.
  // We can't use an empty string id on the frontend because the field is mandatory.
  // We need to transform the id 'UNLISTED' to an empty string before sending the
  // data to the server.
  newData.game_id = newData.game_id === 'UNLISTED' ? '' : newData.game_id;
  newData.training_session_id =
    newData.training_session_id === 'UNLISTED'
      ? ''
      : newData.training_session_id;

  // transform the injury occurrence events data to the request data
  const events = [];
  newData.events_order.forEach((eventId) => {
    const isANewEvent = eventId.toString().includes('new_status');

    const issueEvent = newData.events[eventId];
    events.push({
      id: !isANewEvent ? issueEvent.id : '',
      injury_status_id: issueEvent.injury_status_id,
      date: issueEvent.date,
    });
  });

  if (formType === 'ILLNESS') {
    delete newData.activity_id;
    delete newData.activity_type;
    delete newData.occurrence_min;
    delete newData.session_completed;
    delete newData.position_when_injured_id;
    delete newData.bamic_grade_id;
    delete newData.bamic_site_id;

    // In order to prevent conflict with the already existing Illness types on the backend
    // We need to rename type_id to onset_id when the issue is an illness.
    newData.onset_id = issueData.type_id;
  }

  if (formType === 'INJURY') {
    delete newData.type_id;
  }

  const data = Object.assign({}, newData, {
    events,
    notes: newNotes,
  });

  return JSON.stringify(data);
};
/* eslint-enable max-statements */

export const buildIssueState = (
  injuryData: IssueOccurrence,
  formType: 'INJURY' | 'ILLNESS'
) => {
  const newInjuryData: Object = Object.assign({}, injuryData);

  // Set the initial state for the supplementary pathology checkbox
  if (injuryData.supplementary_pathology) {
    newInjuryData.has_supplementary_pathology = true;
  }

  // If game_id or training_session_id are null it means the game
  // or training session is unlisted.
  // The matching Id on the frontend is 'UNLISTED'.
  newInjuryData.game_id = newInjuryData.game_id || 'UNLISTED';
  newInjuryData.training_session_id =
    newInjuryData.training_session_id || 'UNLISTED';

  // Events Ids need to be strings on the frontend
  // as we create our own ids when adding an event.
  newInjuryData.events_order = newInjuryData.events_order.map((eventId) =>
    eventId.toString()
  );

  const formattedEvents = {};
  newInjuryData.events_order.forEach((eventId, index) => {
    formattedEvents[eventId] = newInjuryData.events[index];
  });
  newInjuryData.events = formattedEvents;

  // In order to prevent conflict with the already existing Illness types on the backend
  // We get onset_id instead of type_id when the issue is an illness.
  if (formType === 'ILLNESS') {
    newInjuryData.type_id = injuryData.onset_id;
    delete newInjuryData.onset_id;
  }

  return newInjuryData;
};
/* eslint-enable max-statements */

export const getDefaultIssueState = (
  athleteId: $PropertyType<Athlete, 'id'>,
  modificationInfo: $PropertyType<Athlete, 'modification_info'>
) => ({
  athlete_id: athleteId,
  has_recurrence: false,
  recurrence_id: null,
  osics: {
    osics_id: null,
    osics_pathology_id: null,
    osics_classification_id: null,
    osics_body_area_id: null,
    icd: null,
  },
  side_id: null,
  type_id: null,
  activity_id: null,
  activity_type: null,
  game_id: null,
  training_session_id: null,
  occurrence_min: null,
  supplementary_pathology: null,
  has_supplementary_pathology: false,
  association_period_id: null,
  session_completed: null,
  position_when_injured_id: null,
  created_by: '',
  closed: false,
  id: null,
  occurrence_date: null,
  events_order: ['new_status'],
  events: {
    new_status: {
      injury_status_id: null,
      date: null,
    },
  },
  notes: [],
  modification_info: modificationInfo,
  total_duration: null,
  unavailability_duration: null,
  events_duration: {},
  prior_resolved_date: null,
  staticData: {
    injuryOsicsPathologies: [],
    illnessOsicsPathologies: [],
    injuryOsicsClassifications: [],
    illnessOsicsClassifications: [],
    injuryOsicsBodyAreas: [],
    illnessOsicsBodyAreas: [],
    injuryOnsets: [],
    illnessOnsets: [],
  },
});

export const getPriorIssueFromIssueId = (
  priorIssues: Array<PriorIssue>,
  issueId: number
) => priorIssues.filter((priorIssue) => priorIssue.id === issueId)[0];
