// @flow
import moment from 'moment';
import i18n from '@kitman/common/src/utils/i18n';
import toChainable from 'lodash';
import {
  dateTransferFormat,
  formatStandard,
  formatShortOrgLocale,
} from '@kitman/common/src/utils/dateFormatter';
import type { SelectOption as SelectOptionAsync } from '@kitman/components/src/AsyncSelect';
import type {
  Coding,
  DATALYS,
  ICD,
  CLINICAL_IMPRESSIONS,
  CodingSystem,
} from '@kitman/common/src/types/Coding';
import codingSystemKeys from '@kitman/common/src/variables/codingSystemKeys';
import type {
  FreeTextComponent,
  IssueOccurrenceRequested,
  Osics,
} from '@kitman/common/src/types/Issues';
import type {
  IssueContactType,
  IssueContactTypes,
} from '@kitman/services/src/services/medical/getIssueContactTypes';
import type { InjuryReportRow } from '@kitman/services/src/services/medical/getInjuryReport';
import {
  EditorState,
  // $FlowFixMe Draft JS issue with flow https://github.com/facebook/draft-js/issues/1974
} from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';
import { V2_MULTI_CODING_SYSTEMS } from '@kitman/modules/src/Medical/shared/constants/codingSystem';

// Types
import type { TreatmentSessionOptions } from '@kitman/services/src/services/medical/getTreatmentSessionOptions';
import type { ActivityGroups } from '@kitman/services/src/services/medical/getActivityGroups';
import type { PositionGroups } from '@kitman/services/src/services/getPositionGroups';
import type { SelectOption, Options } from '@kitman/components/src/types';
import type { InjuryStatus } from '@kitman/services/src/services/getInjuryStatuses';
import type { InjuryMechanisms } from '@kitman/services/src/services/medical/getInjuryMechanisms';
import type { Sides } from '@kitman/services/src/services/medical/getSides';
import type { AnnotationForm } from '@kitman/modules/src/Medical/shared/types';
import type { AthleteIssues } from '@kitman/services/src/services/medical/getAthleteIssues';
import type { Option } from '@kitman/playbook/types';
import type { DetailedGameAndTrainingOptions } from '../types/medical/GameAndTrainingOptions';
import type {
  AllergiesFilter,
  IssueType,
  NotesFilters,
  ModificationFilters,
  TreatmentFilter,
  DiagnosticFilter,
  SelectEventOption,
  Visibility,
  FormFilter,
  DetailedGameEventOption,
  Issue,
  IssueDetails,
  ProceduresFilter,
  DetailedTrainingSessionEventOption,
  DrFirstMedicationsFilter,
  OtherEventOption,
} from '../types';
import type { InjuryIllnessSummary } from '../types/medical/QuestionTypes';
import type { IssueAttachments } from '../../rosters/types';
import type { Pathology as MultiCodingV2Pathology } from '../types/medical/MultiCodingV2';

export const BASE_URL = '/medical/rosters';

export const getStatusOptions = ({
  currentIndex,
  previousId,
  statuses,
  excludeResolvers,
}: {
  currentIndex: number,
  previousId: ?string,
  statuses: Array<InjuryStatus>,
  excludeResolvers: boolean,
}) => {
  const statusOptions = [];
  if (!statuses) return statusOptions;

  if (currentIndex !== 0 && previousId) {
    return statuses
      .filter((status) => {
        if (!excludeResolvers) {
          return true;
        }
        return !status.is_resolver;
      })
      .filter((item) => item.id !== previousId)
      .map<SelectOptionAsync>((item) => {
        return {
          label: item.description,
          value: item.id,
        };
      });
  }

  return statuses
    .filter((status) => {
      if (!excludeResolvers) {
        return true;
      }
      return !status.is_resolver;
    })
    .map<SelectOptionAsync>((item) => {
      return {
        label: item.description,
        value: item.id,
      };
    });
};

export const getIssueTypeValueFromSidePanel = (
  selectedIssueType: string
): string => {
  switch (selectedIssueType) {
    case 'INJURY':
      return 'injury_occurrence';
    case 'ILLNESS':
      return 'illness_occurrence';
    case 'INJURY_RECURRENCE':
      return 'recurrence';
    case 'ILLNESS_RECURRENCE':
      return 'recurrence';
    case 'CHRONIC_INJURY':
      return 'chronic_issue';
    case 'CHRONIC_ILLNESS':
      return 'chronic_issue';
    case 'CHRONIC_INJURY_OCCURRENCE':
      return 'chronic_issue';
    case 'INJURY_CONTINUATION':
      return 'continuation';
    case 'ILLNESS_CONTINUATION':
      return 'continuation';
    default:
      return '';
  }
};

export const getIssueTypeFromPayload = (issue: Object): string => {
  if (issue.continuation_issue) {
    return 'continuation';
  }
  if (issue.has_recurrence) {
    return 'recurrence';
  }
  if (issue.isChronic) {
    return 'chronic_issue';
  }
  if (issue.issueType === 'Illness') {
    return 'illness_occurrence';
  }
  if (issue.issueType === 'Injury') {
    return 'injury_occurrence';
  }
  return '';
};

export const getIssueTypePath = (issueType: IssueType | string) => {
  let issueTypePath: string = 'injuries'; // This covers ChronicInjury
  if (issueType) {
    switch (issueType.toLowerCase()) {
      case 'illness':
      case 'chronicillness':
        issueTypePath = 'illnesses';
        break;
      case 'emr::private::models::chronicissue':
        issueTypePath = 'chronic_issues';
        break;
      default:
    }
  }
  return issueTypePath;
};

export const getSortedEventOptions = (
  eventOptions: SelectEventOption[]
): SelectEventOption[] =>
  eventOptions.sort((nextEventOption, prevEventOption) =>
    nextEventOption.value !== 'unlisted_training' &&
    prevEventOption.value === 'unlisted_game'
      ? -1
      : 0
  );

export const getEditorStateFromValue = (value: string) =>
  EditorState.createWithContent(stateFromHTML(value));

export const createRichTextEditorAltContent = (inputText: string) => ({
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: inputText,
        },
      ],
    },
  ],
});

/**
 * @param {issueType} IssueType the type of the issue, it could be "Injury" or "Illness"
 * @param {options} Array of Options
 * @returns {ids} Array of numbers
 */

export const getIssueIdsFromOptions = (
  issueType: IssueType,
  options: Array<Option>
): Array<number> =>
  options
    .filter((option) => option.type === issueType)
    .map((option) => parseInt(option.id, 10));

/**
 * @param {issueType} IssueType the type of the issue, it could be "Injury" or "Illness"
 * @param {ids} Array of strings with the ids of the issues like Injury_1 or Illness_1
 * @returns {ids} Array of numbers
 */

export const getIssueIds = (issueType: IssueType, ids: string[]): number[] =>
  ids
    .filter((id) => id.startsWith(`${issueType}_`))
    .map((id) => {
      const currentId = id.replace(`${issueType}_`, '');
      return parseInt(currentId, 10);
    });

/**
 * @param {injuryIds} Array of numbers with the ids of the issues
 * @param {illnessIds} Array of numbers with the ids of the issues
 * @param {chronicIds} Array of numbers with the ids of the issues
 * @returns {formattedIds} Array of string like ['Injury_1', 'Illness_1', 'ChronicInjury_1']
 */

export const getFormattedIssueIds = (
  injuryIds: number[],
  illnessIds: number[],
  chronicIds: number[] = []
): string[] => {
  return [
    ...injuryIds.map((id) => `Injury_${id}`),
    ...illnessIds.map((id) => `Illness_${id}`),
    ...chronicIds.map((id) => `ChronicInjury_${id}`),
  ];
};

export const getRestricVisibilityValue = (
  isDoctorsVisibility: boolean,
  isPsychVisibility: boolean
): Visibility => {
  if (isDoctorsVisibility) {
    return 'DOCTORS';
  }
  if (isPsychVisibility) {
    return 'PSYCH_TEAM';
  }

  return 'DEFAULT';
};

export const emptyHTMLeditorContent = '<p><br></p>';
export const emptyHTMLeditorAltContent = '<p></p>';

export const getDefaultDateRange = () => ({
  start_date: moment().subtract(12, 'months').format(dateTransferFormat),
  end_date: moment().endOf('day').format(dateTransferFormat),
});

export const getFormFilters = ({
  athleteId,
  category,
  group,
  injuryOccurenceId,
  illnessOccurenceId,
  key,
}: {
  athleteId: ?string,
  category: string,
  group: string,
  injuryOccurenceId: ?string,
  illnessOccurenceId: ?string,
  key: string,
}): FormFilter => ({
  athleteId: athleteId || undefined,
  category,
  group,
  injuryOccurenceId: injuryOccurenceId || undefined,
  illnessOccurenceId: illnessOccurenceId || undefined,
  key,
});

export const getDefaultNotesFilters = ({
  athleteId,
  issueId,
  issueType,
  isModification,
  diagnosticId,
  procedureId,
}: {
  athleteId: ?number | string,
  issueId?: number,
  issueType?: IssueType,
  isModification?: boolean,
  diagnosticId?: number,
  procedureId?: number,
}): NotesFilters => {
  const annotationTypes = [];
  if (isModification) {
    annotationTypes.push('OrganisationAnnotationTypes::Modification');
  } else {
    annotationTypes.push(
      ...[
        'OrganisationAnnotationTypes::Medical',
        'OrganisationAnnotationTypes::Nutrition',
        'OrganisationAnnotationTypes::Diagnostic',
        'OrganisationAnnotationTypes::Procedure',
        'OrganisationAnnotationTypes::LegacyPresagiaConcussion',
      ]
    );

    if (window.featureFlags['display-telephone-note']) {
      annotationTypes.push('OrganisationAnnotationTypes::Telephone');
    }

    if (window.featureFlags['rehab-note']) {
      annotationTypes.push('OrganisationAnnotationTypes::RehabSession');
    }

    if (window.featureFlags['command-health-integration']) {
      annotationTypes.push('OrganisationAnnotationTypes::MedicalDictation');
    }

    if (window.featureFlags['coaches-report-refactor']) {
      annotationTypes.push('OrganisationAnnotationTypes::DailyStatusNote');
    }
  }

  return {
    archived: false,
    content: '',
    athlete_id: athleteId || null,
    squads: [],
    author: [],
    organisation_annotation_type_ids: [],
    organisation_annotation_type: annotationTypes,
    date_range: null,
    per_page: 8,
    ...(diagnosticId && {
      diagnostic_id: diagnosticId,
    }),
    // need to Prettier ignore next node to keep FlowFixMe comment in correct place
    // prettier-ignore
    ...(issueId &&
    issueType && // $FlowFixMe known 'bug' Flow Issue that they don't intend to fix soon https://github.com/facebook/flow/issues/8186
    { issue_occurrence: { id: issueId, type: issueType } }),
    // prettier-ignore
    ...(procedureId && // $FlowFixMe known 'bug' Flow Issue that they don't intend to fix soon https://github.com/facebook/flow/issues/8186
      { procedure_id: procedureId }),
  };
};

export const getModificationNotesFilter = ({
  athleteId,
  issueId,
  issueType,
}: {
  athleteId: ?number | string,
  issueId?: number,
  issueType?: IssueType,
}): ModificationFilters => ({
  content: '',
  athlete_id: athleteId || null,
  squads: [],
  author: [],
  organisation_annotation_type_ids: [],
  organisation_annotation_type: ['OrganisationAnnotationTypes::Modification'],
  date_range: {
    start_date: moment().subtract(6, 'weeks').format(dateTransferFormat),
    end_date: moment().format(dateTransferFormat),
  },
  ...(issueId &&
    issueType && {
      issue_occurrence: { id: issueId, type: issueType },
    }),
});

export const getDefaultTreatmentFilters = ({
  athleteId,
  issueId,
  issueType,
  isChronicIssue,
}: {
  athleteId: ?number | string,
  issueId: ?number,
  issueType: ?IssueType,
  isChronicIssue: ?boolean,
}): TreatmentFilter => {
  let updatedIssueType = '';
  if (isChronicIssue) {
    updatedIssueType = 'Emr::Private::Models::ChronicIssue';
  } else {
    updatedIssueType =
      issueType === 'Injury' ? 'injury_occurrence' : 'illness_occurrence';
  }

  const treatmentFilter: any = {
    athlete_id: athleteId || null,
    search_expression: '',
    squads: [],
    date_range: null,
  };

  if (issueId && issueType) {
    treatmentFilter.issue_occurrence = {
      id: issueId,
      type: updatedIssueType,
    };
  }

  return treatmentFilter;
};

const nullToEmptyString = (field: string | null) => (!field ? '' : field);

const dateParser = (date: string | null) =>
  !date
    ? ''
    : `(${formatStandard({
        date: moment(date),
      })})`;

const parseGameName = (detailedGame: DetailedGameEventOption) =>
  `${detailedGame.name} ${dateParser(detailedGame.game_date)}${
    !detailedGame.score
      ? ''
      : ` ${detailedGame.score}-${nullToEmptyString(
          detailedGame.opponent_score
        )}`
  }`;

const returnOptionValue = (
  option: DetailedGameEventOption | DetailedTrainingSessionEventOption,
  type: string,
  isChronic?: boolean
) => {
  let value;
  if (isChronic) {
    value = option.event_id ? option.event_id : `unlisted`;
  } else {
    value = option.value;
  }
  return `${value}_${type}`;
};

export const getGameAndTrainingOptions = (
  gameAndTrainingOptions: DetailedGameAndTrainingOptions,
  isChronic?: boolean
): Array<SelectEventOption> => {
  const options = [
    ...gameAndTrainingOptions.games.map((game) => ({
      label: parseGameName(game),
      value: returnOptionValue(game, 'game', isChronic),
    })),
    ...gameAndTrainingOptions.training_sessions.map((trainingSession) => ({
      label: `${trainingSession.name} ${dateParser(
        trainingSession.training_date
      )}`,
      value: returnOptionValue(trainingSession, 'training', isChronic),
    })),
  ];

  return options;
};

export const getGameAndTrainingGroupedOptions = ({
  gameAndTrainingOptions,
  isChronic,
}: {
  gameAndTrainingOptions: DetailedGameAndTrainingOptions,
  isChronic?: boolean,
}) => {
  const groupedOptions = [
    ...toChainable(gameAndTrainingOptions.games)
      .groupBy((game) => game.squad.name)
      .map((games) => {
        return {
          label: games[0].squad.name,
          options: games.map((game) => ({
            label: parseGameName(game),
            value: returnOptionValue(game, 'game', isChronic),
          })),
        };
      })
      .value(),
    ...toChainable(gameAndTrainingOptions.training_sessions)
      .groupBy((trainingSession) => trainingSession.squad.name)
      .map((trainingSessions) => {
        return {
          label: trainingSessions[0].squad.name,
          options: trainingSessions.map((trainingSession) => ({
            label: `${trainingSession.name} ${dateParser(
              trainingSession.training_date
            )}`,
            value: returnOptionValue(trainingSession, 'training', isChronic),
          })),
        };
      })
      .value(),
  ];

  return groupedOptions;
};

export const getAdditionalEventOptions = (
  otherEvents: Array<OtherEventOption>
): Array<SelectEventOption> => {
  const sharedOptions = [{ label: i18n.t('Other'), value: 'other_other' }];
  if (
    window.featureFlags['medical-additional-event-info-events'] &&
    otherEvents?.length > 0
  ) {
    return [
      ...sharedOptions,
      ...otherEvents.map((event) => ({
        label: event.label,
        value: `other_${event.shortname}`,
      })),
    ];
  }
  if (window.featureFlags['nfl-injury-flow-fields']) {
    // HEALTH WARNING:
    // the value here is split by _ and the latter half is stored in the db as the `activity_type`
    // i.e. in the following case that means nonfootball and prior are set as the activity_type
    // Changing these will have knock on implications of data stored in the db so don't do so without
    // BE input. reference -> https://github.com/KitmanLabs/projects/issues/23563
    return [
      ...sharedOptions,
      {
        label: i18n.t('Not Club Football-Related'),
        value: 'other_nonfootball',
      },
      {
        label: i18n.t('Injury Occurred Prior to/Outside of NFL'),
        value: 'other_prior',
      },
    ];
  }

  return [
    ...sharedOptions,
    { label: i18n.t('Unlisted Game'), value: 'unlisted_game' }, // NOTE: Adding a non empty string value
    { label: i18n.t('Unlisted Practice'), value: 'unlisted_training' }, // NOTE: 'Unlisted Practice' is a replacement for 'Unlisted Training Session'
  ];
};

export const getPositionOptions = (positionGroups: PositionGroups) => {
  const positionOptions = [];
  if (positionGroups.length === 0) return positionOptions;

  positionGroups.forEach((group) => {
    group.positions.forEach((position) => {
      positionOptions.push({
        label: position.name,
        value: position.id,
      });
    });
  });

  return positionOptions;
};

export const isChronicIssue = (issueType: string) => {
  return (
    window.featureFlags['chronic-injury-illness'] &&
    (issueType === 'CHRONIC_INJURY' || issueType === 'CHRONIC_ILLNESS')
  );
};

export const issueIsAnInjury = (issueType: string) => {
  return !!issueType?.includes('INJURY');
};

export const getActivityGroupOptions = (
  activityGroups: ActivityGroups,
  eventType: string
): Array<SelectOption> => {
  const activityOptions = [];
  if (activityGroups.length === 0) return activityOptions;

  return activityGroups
    .filter((group) => group.event_type === eventType)
    .map((group) => {
      return {
        label: group.name,
        options: group.activities.map((activity) => {
          return {
            label: activity.name,
            value: activity.id,
            description: activity.description || '',
            ...(activity.require_additional_input
              ? {
                  requiresText: activity.require_additional_input,
                }
              : {}),
          };
        }),
      };
    });
};

export const getDefaultDiagnosticFilters = ({
  athleteId,
  issueId,
  issueType,
  isChronic,
}: {
  athleteId: ?number | string,
  issueId?: ?number,
  issueType?: ?IssueType,
  isChronic?: boolean,
}): DiagnosticFilter => {
  const updatedIssueType = isChronic
    ? 'Emr::Private::Models::ChronicIssue'
    : (issueType || '').toLowerCase();
  return {
    athlete_id: athleteId || null,
    search_expression: '',
    squads: [],
    date_range: null,
    diagnostic_location_ids: [],
    diagnostic_reason_ids: [],
    statuses: [],
    reviewed: null,
    provider_sgids: [],
    diagnostic_type_ids: [],
    result_type: [],
    ...(issueId &&
      issueType && {
        issue_occurrence: { id: issueId, type: updatedIssueType },
      }),
  };
};

export const getDefaultDrFirstMedicationsFilters = ({
  athleteId = null,
  issueId = null,
  issueType = null,
}: {
  athleteId: ?number | string,
  issueId?: ?number,
  issueType?: ?string,
}): DrFirstMedicationsFilter => {
  return {
    date_range: null,
    athlete_id: athleteId,
    search_expression: '',
    issue_id: issueId,
    issue_type: issueType,
    squad_ids: [],
    position_ids: [],
    categories: [],
    archived: false,
    status: [],
  };
};

export const getDefaultAllergiesFilters = ({
  athleteId,
  issueId,
  issueType,
}: {
  athleteId: ?number | string,
  issueId?: ?number,
  issueType?: ?IssueType,
}): AllergiesFilter => {
  return {
    athlete_id: athleteId || null,
    search_expression: '',
    squad_ids: [],
    position_ids: [],
    severities: [],
    ...(issueId &&
      issueType && {
        issue_occurrence: { id: issueId, type: issueType.toLowerCase() },
      }),
    categories: [],
    archived: false,
  };
};

export const getDefaultProceduresFilters = ({
  athleteId,
  issueId,
  issueType,
}: {
  athleteId: ?number | string,
  issueId?: ?number,
  issueType?: ?IssueType,
}): ProceduresFilter => {
  return {
    athlete_ids: [athleteId] || null,
    search_expression: '',
    squads: [],
    date_range: null,
    procedure_location_ids: [],
    procedure_reason_ids: [],
    procedure_type_ids: [],
    ...(issueId &&
      issueType && {
        issue_occurrence: { id: issueId, type: issueType },
      }),
  };
};

export const formatTreatmentSessionOptionsForSelectComponent = (
  data: TreatmentSessionOptions
) => {
  const modalityOptions = [];
  const bodyAreaOptions = [];
  let reasonOptions = [];

  data.treatment_modality_options.forEach((modality) => {
    if (modality.isGroupOption) {
      modalityOptions.push({
        label: modality.name,
        options: [],
      });
    } else {
      // $FlowFixMe options will exist here
      modalityOptions[modalityOptions.length - 1].options.push({
        label: modality.name,
        value: modality.key_name,
      });
    }
  });

  data.treatable_area_options.forEach((bodyArea) => {
    bodyAreaOptions.push({
      label: `${bodyArea.name} - ${bodyArea.description}`,
      value: bodyArea.value,
      isGroupOption: !!bodyArea.isGroupOption,
    });
  });

  reasonOptions = [
    {
      value: {
        reason: 'general',
        issue_type: null,
        issue_id: null,
      },
      label: `${i18n.t('General Treatment')} - ${i18n.t('unrelated to issue')}`,
    },
    {
      value: {
        reason: 'recovery',
        issue_type: null,
        issue_id: null,
      },
      label: `${i18n.t('Recovery')} - ${i18n.t('unrelated to issue')}`,
    },
    {
      value: {
        reason: 'preparation',
        issue_type: null,
        issue_id: null,
      },
      label: `${i18n.t('Preparation')} - ${i18n.t('unrelated to issue')}`,
    },
  ];

  data.issues_options.forEach((issueOption) => {
    if (issueOption.isGroupOption) {
      reasonOptions.push({
        label: issueOption.name,
        options: [],
      });
    } else {
      const dateFormatted = formatShortOrgLocale(
        moment(issueOption.occurrence_date)
      );
      // options will exist here
      // data.issues_options will always contain isGroupOption items at a minimum
      // $FlowFixMe
      reasonOptions[reasonOptions.length - 1].options.push({
        label: `${dateFormatted} - ${issueOption.name}`,
        value: JSON.parse(issueOption.key_name),
      });
    }
  });

  return { modalityOptions, bodyAreaOptions, reasonOptions };
};

export const getICDFieldOption = (icd: ICD): SelectOptionAsync => ({
  value: icd,
  label: `${icd.code} ${icd.diagnosis}`,
});

export const getDatalysFieldOption = (datalys: DATALYS): SelectOptionAsync => ({
  value: datalys,
  label: `${datalys.code} ${datalys.pathology}`,
});

export const getCIFieldOption = (
  ci: CLINICAL_IMPRESSIONS
): SelectOptionAsync => ({
  value: ci,
  label: `${ci.code} ${ci.pathology}`,
});

export const getPathologyFieldOption = (
  pathology: MultiCodingV2Pathology
): SelectOptionAsync => ({
  value: pathology,
  label: [pathology.code, pathology.pathology].filter(Boolean).join(' '),
});

export const isV2MultiCodingSystem = (codingSystemKey: string): boolean => {
  return V2_MULTI_CODING_SYSTEMS.includes(codingSystemKey);
};

export const getCodingFieldOption = (coding: Coding): SelectOptionAsync => {
  if (coding[codingSystemKeys.ICD]) {
    return coding[codingSystemKeys.ICD]?.icd_id
      ? getICDFieldOption(coding[codingSystemKeys.ICD])
      : null;
  }
  if (coding[codingSystemKeys.DATALYS]) {
    return coding[codingSystemKeys.DATALYS]?.id
      ? getDatalysFieldOption(coding[codingSystemKeys.DATALYS])
      : null;
  }
  if (coding[codingSystemKeys.CLINICAL_IMPRESSIONS]) {
    return coding[codingSystemKeys.CLINICAL_IMPRESSIONS]?.id
      ? getCIFieldOption(coding[codingSystemKeys.CLINICAL_IMPRESSIONS])
      : null;
  }
  if (coding[codingSystemKeys.OSIICS_15]) {
    return coding[codingSystemKeys.OSIICS_15]?.id
      ? getPathologyFieldOption(coding[codingSystemKeys.OSIICS_15])
      : null;
  }

  return null;
};

export const getCodingSystemFromCoding = (coding: Coding): ?CodingSystem => {
  // eslint-disable-next-line no-restricted-syntax
  for (const codingKey of Object.values(codingSystemKeys)) {
    if (typeof codingKey === 'string' && coding[codingKey]) {
      return coding[codingKey];
    }
  }
  return null;
};

// TODO: filter by group 'concussion' should be supported soon on issue occurrence, then we won't need this
export const filterConcussions = (issue: IssueDetails) => {
  if (window.featureFlags['emr-multiple-coding-systems']) {
    if (issue.coding) {
      const codingSystem = getCodingSystemFromCoding(issue.coding);
      return codingSystem?.groups?.includes('concussion');
    }
  }

  // Fallback
  return issue.osics?.groups?.includes('concussion');
};

// TODO: filter by group 'concussion' should be supported soon on issue occurrence, then we won't need this
export const filterEnrichedIssueConcussions = (enrichedIssue: Issue) => {
  return enrichedIssue.issue ? filterConcussions(enrichedIssue.issue) : false;
};

export const getPathologyName = (
  injury: InjuryIllnessSummary | IssueDetails | InjuryReportRow
): string => {
  // TODO: Clean up once we resolve the differences in coding objects and various types we have for an injury
  if (
    // $FlowIgnore
    injury.supplementary_pathology &&
    window.featureFlags['custom-pathologies']
  ) {
    // $FlowIgnore
    return injury.supplementary_pathology;
  }

  let pathology;
  // $FlowIgnore
  if (window.featureFlags['emr-multiple-coding-systems'] && injury.coding) {
    const codingSystem = getCodingSystemFromCoding(injury.coding);

    pathology =
      codingSystem?.pathology ||
      codingSystem?.diagnosis ||
      codingSystem?.osics_pathology ||
      injury.coding?.pathologies?.[0]?.pathology;
  }

  if (!pathology && injury.osics && injury.osics.pathology) {
    // Fallback to legacy OSICS
    pathology = injury.osics?.pathology;
  }

  // $FlowIgnore If not a string then expect an object with name property
  return typeof pathology === 'string' ? pathology : pathology?.name || '';
};

export const getCodingSystemFromIssue = (
  issue: IssueOccurrenceRequested
): ?CodingSystem | ?Osics => {
  if (window.featureFlags['emr-multiple-coding-systems'] && issue.coding) {
    const codingSystem = getCodingSystemFromCoding(issue.coding);
    if (codingSystem) {
      return codingSystem;
    }
  }
  // Feature flag off and Fallback:
  return issue.osics;
};

export const getOtherEventFromIssue = (
  issue: IssueOccurrenceRequested
): string | null => {
  const otherValue =
    issue.extended_attributes?.find(
      ({ attribute_name: attributeName }) =>
        attributeName === 'other_event_selection'
    )?.value || null;

  return otherValue;
};

export const getBamicGradeTitle = (issue: IssueOccurrenceRequested) => {
  const bamicGradeDetails = {
    bamic_grade: issue?.bamic_grade || null,
    bamic_site: issue?.bamic_site || null,
  };
  if (!window.featureFlags['include-bamic-on-injury']) return '';
  if (!bamicGradeDetails?.bamic_grade?.grade) return '';
  return `- Grade ${bamicGradeDetails.bamic_grade.grade}${
    bamicGradeDetails?.bamic_site?.site || ''
  }`;
};

export const getPathologyTitle = (issue: IssueOccurrenceRequested): string => {
  const osicsInfo = window.featureFlags['emr-multiple-coding-systems']
    ? issue?.coding[codingSystemKeys.OSICS_10]
    : issue?.osics;

  if (!window.featureFlags['emr-multiple-coding-systems']) {
    return issue?.supplementary_pathology || osicsInfo?.osics_pathology || '';
  }

  const codingSystemPathology =
    typeof issue.coding.pathologies?.[0]?.pathology === 'string'
      ? issue.coding.pathologies[0].pathology
      : '';

  return (
    issue?.supplementary_pathology ||
    osicsInfo?.osics_pathology ||
    issue?.coding[codingSystemKeys.ICD]?.diagnosis ||
    issue?.coding[codingSystemKeys.DATALYS]?.pathology ||
    issue?.coding[codingSystemKeys.CLINICAL_IMPRESSIONS]?.pathology ||
    codingSystemPathology ||
    ''
  );
};

export const getRequestedIssueTitle = (
  issue: IssueOccurrenceRequested
): string => {
  if (
    window.featureFlags['supplemental-recurrence-code'] &&
    issue.supplementary_coding &&
    !issue.issue_occurrence_title
  ) {
    return issue.supplementary_coding;
  }

  if (!issue.issue_occurrence_title) {
    return `${getPathologyTitle(issue)} ${getBamicGradeTitle(issue)}`.trim();
  }

  return issue.issue_occurrence_title;
};

export const getIssueTitle = (
  issue: {
    full_pathology: $PropertyType<Issue, 'full_pathology'>,
    issue_occurrence_title: $PropertyType<Issue, 'issue_occurrence_title'>,
    occurrence_date: $PropertyType<Issue, 'occurrence_date'>,
  },

  prefixOccurrenceDateIfPresent: boolean,
  customTitle: ?string = null
): string => {
  let prefix = '';

  if (prefixOccurrenceDateIfPresent && issue.occurrence_date) {
    prefix = `${formatStandard({
      date: moment(issue.occurrence_date),
      showCompleteDate: false,
      displayLongDate: false,
    })} - `;
  }

  if (customTitle) {
    return `${prefix}${customTitle}`;
  }

  if (issue.issue_occurrence_title) {
    return `${prefix}${issue.issue_occurrence_title}`;
  }

  if (issue.full_pathology) {
    return `${prefix}${issue.full_pathology}`;
  }

  return `${prefix}${i18n.t('Preliminary')}`;
};

export const mapIssuesToOptions = (
  issues: Array<Issue>,
  group: string
): Array<Option> =>
  issues.map(
    ({
      id,
      full_pathology: fullPathology,
      issue_occurrence_title: title,
      issue_type: type,
      occurrence_date: date,
    }) => ({
      id,
      label: getIssueTitle(
        {
          full_pathology: fullPathology,
          issue_occurrence_title: title,
          occurrence_date: date,
        },
        true
      ),
      type,
      group,
    })
  );

export const mapIssuesToSelectOptions = (
  issues: Array<Issue>
): Array<Options> =>
  issues.map(
    ({
      id,
      full_pathology: fullPathology,
      issue_occurrence_title: title,
      issue_type: type,
      occurrence_date: date,
    }) => ({
      value: `${type}_${id}`,
      label: getIssueTitle(
        {
          full_pathology: fullPathology,
          issue_occurrence_title: title,
          occurrence_date: date,
        },
        true
      ),
    })
  );

export const defaultDiagnosticsBillingFileName = `${i18n.t(
  'Diagnostics billing'
)}`;

export const defaultTreatmentBillingFileName = `${i18n.t('Treatment billing')}`;

export const mapParentAndChildrenToOptions = (
  parents: InjuryMechanisms | IssueContactTypes
): Array<SelectOption> => {
  const mapToOption = ({
    id,
    name,
    require_additional_input: requiresText,
  }) => ({
    label: name,
    value: id,
    ...(requiresText
      ? {
          requiresText,
        }
      : {}),
  });

  return parents.reduce((acc, parent) => {
    const parentOptions = [...acc];
    const children = parents.filter((child) => parent.id === child.parent_id);

    if (children.length > 0) {
      parentOptions.push({
        label: parent.name,
        options: children.map(mapToOption),
      });
    } else if (parent.parent_id === null) {
      parentOptions.push(mapToOption(parent));
    }

    return parentOptions;
  }, []);
};

export const getInjuryMechanismLabel = (
  mechanismId: ?number,
  mechanisms: InjuryMechanisms
): ?string => {
  const selectedMechanism = mechanisms.find(({ id }) => mechanismId === id);

  if (!selectedMechanism) {
    return null;
  }

  const parent = mechanisms.find(
    ({ id }) => id === selectedMechanism.parent_id
  );

  if (!parent) {
    return selectedMechanism.name;
  }

  return `${parent.name}: ${selectedMechanism.name}`;
};

export const filterInactiveSides = (sides: Sides): Sides => {
  return sides.filter(({ active }) => {
    if (typeof active === 'undefined') {
      return true;
    }
    return active;
  });
};

export const getFreetextValue = (
  issue: IssueOccurrenceRequested,
  type: string
) =>
  issue?.freetext_components?.find((freetext) => freetext.name === type)?.value;

export const updateFreetextComponentResults = (
  freetextComponents: FreeTextComponent[] = [],
  type: string,
  newFreetext: string = ''
) => {
  const uptoDateFreeTexts: FreeTextComponent[] = freetextComponents;
  if (type === 'issue_reopening_reasons' && newFreetext) {
    uptoDateFreeTexts.push({ name: type, value: newFreetext });
  } else {
    const freetextIndex = uptoDateFreeTexts.findIndex(
      (freetext) => freetext.name === type
    );
    if (freetextIndex >= 0) {
      uptoDateFreeTexts[freetextIndex].value = newFreetext;
    } else if (newFreetext) {
      uptoDateFreeTexts.push({ name: type, value: newFreetext });
    }
  }

  return uptoDateFreeTexts;
};

export const checkOptionRequiresTextField = (
  options: Array<SelectOption>,
  id: number | string
) => {
  let foundOption;
  // eslint-disable-next-line no-restricted-syntax
  for (const option of options) {
    if (option.options) {
      foundOption = option.options.find((activity) => activity.value === id);
    } else if (option.value === id) {
      foundOption = option;
    }
    if (foundOption) return !!foundOption?.requiresText;
  }
  return false;
};

export const getAmericanStateOptions = () => {
  return [
    { value: 'Alabama', label: 'AL' },
    { value: 'Alaska', label: 'AK' },
    { value: 'Arizona', label: 'AZ' },
    { value: 'Arkansas', label: 'AR' },
    { value: 'California', label: 'CA' },
    { value: 'Colorado', label: 'CO' },
    { value: 'Connecticut', label: 'CT' },
    { value: 'Delaware', label: 'DE' },
    { value: 'Florida', label: 'FL' },
    { value: 'Georgia', label: 'GA' },
    { value: 'Hawaii', label: 'HI' },
    { value: 'Idaho', label: 'ID' },
    { value: 'Illinois', label: 'IL' },
    { value: 'Indiana', label: 'IN' },
    { value: 'Iowa', label: 'IA' },
    { value: 'Kansas', label: 'KS' },
    { value: 'Kentucky', label: 'KY' },
    { value: 'Louisiana', label: 'LA' },
    { value: 'Maine', label: 'ME' },
    { value: 'Maryland', label: 'MD' },
    { value: 'Massachusetts', label: 'MA' },
    { value: 'Michigan', label: 'MI' },
    { value: 'Minnesota', label: 'MN' },
    { value: 'Mississippi', label: 'MS' },
    { value: 'Missouri', label: 'MO' },
    { value: 'Montana', label: 'MT' },
    { value: 'Nebraska', label: 'NE' },
    { value: 'Nevada', label: 'NV' },
    { value: 'New Hampshire', label: 'NH' },
    { value: 'New Jersey', label: 'NJ' },
    { value: 'New Mexico', label: 'NM' },
    { value: 'New York', label: 'NY' },
    { value: 'North Carolina', label: 'NC' },
    { value: 'North Dakota', label: 'ND' },
    { value: 'Ohio', label: 'OH' },
    { value: 'Oklahoma', label: 'OK' },
    { value: 'Oregon', label: 'OR' },
    { value: 'Pennsylvania', label: 'PA' },
    { value: 'Rhode Island', label: 'RI' },
    { value: 'South Carolina', label: 'SC' },
    { value: 'South Dakota', label: 'SD' },
    { value: 'Tennessee', label: 'TN' },
    { value: 'Texas', label: 'TX' },
    { value: 'Utah', label: 'UT' },
    { value: 'Vermont', label: 'VT' },
    { value: 'Virginia', label: 'VA' },
    { value: 'Washington', label: 'WA' },
    { value: 'Washington D.C', label: 'DC' },
    { value: 'West Virginia', label: 'WV' },
    { value: 'Wisconsin', label: 'WI' },
    { value: 'Wyoming', label: 'WY' },
  ];
};

export const isAnnotationInvalid = (annotation: IssueAttachments) =>
  annotation.attachmentContent.filesQueue.length > 0 &&
  (!annotation.attachmentContent.content ||
    annotation.attachmentContent.content === emptyHTMLeditorContent);

export const getIssueContactParentChildLabel = (
  options: IssueContactTypes,
  currOption: IssueContactType | null | typeof undefined
) => {
  let parentChildLabel = '';
  if (currOption) {
    if (currOption.parent_id !== null) {
      const foundParent = options.find(
        (option) => option.id === currOption.parent_id
      );
      if (foundParent) parentChildLabel = `${foundParent.name} : `;
    }
    parentChildLabel += currOption.name;
  }
  return parentChildLabel;
};

export const nonInfoEventTypes = ['nonfootball', 'prior', 'nonsport'];

export const isInfoEvent = (eventType: string) => {
  return !nonInfoEventTypes.includes(eventType);
};

export const SESSION_STORAGE_KEY = 'PHIModalAccepted';

export const getPHIModalAccepted = (): boolean => {
  return window.sessionStorage?.getItem(SESSION_STORAGE_KEY) === 'true';
};

export const AnnotationableTypes = {
  athlete: 'Athlete',
  diagnostic: 'Diagnostic',
  procedure: 'Emr::Private::Models::Procedure',
};

export type AnnotationableTypesEnumLike = $Keys<typeof AnnotationableTypes>;

export const getAnnotationableRequiredField = (
  state: AnnotationForm
): boolean => {
  switch (state.annotationable_type) {
    case AnnotationableTypes.diagnostic:
      return !!state.diagnostic_id;
    case AnnotationableTypes.procedure:
      return !!state.procedure_id;
    default:
      return !!state.athlete_id;
  }
};

export const getEventValue = (eventId: string, eventType: string) => {
  return `${eventId}_${eventType}`;
};

export const getGroupedAthleteIssues = ({
  issues,
}: {
  issues: AthleteIssues,
}): Array<SelectOption> => {
  const issuesGrouped = [];
  [
    { group: 'Open injury/illness', issues: issues?.open_issues },
    { group: 'Prior injury/illness', issues: issues?.closed_issues },
    { group: 'Chronic conditions', issues: issues?.chronic_issues }, // Chronics may have a title value
  ].forEach((issueGroup) =>
    issueGroup.issues?.forEach(
      ({
        id,
        full_pathology: fullPathology,
        occurrence_date: date,
        // $FlowIgnore[prop-missing]
        title,
        ...issue
      }) =>
        issuesGrouped.push({
          id,
          label: getIssueTitle(
            {
              full_pathology: fullPathology,
              // $FlowIgnore[prop-missing] issue_occurrence_title exists if issue is not chronic
              issue_occurrence_title: issue.issue_occurrence_title,
              // $FlowIgnore[incompatible-call] occurrence_date is checked in getIssueTitle for being truthy
              occurrence_date: date,
            },
            true,
            title // Will use title as override if exists
          ),
          type:
            issueGroup.group === 'Chronic conditions'
              ? 'ChronicCondition'
              : // $FlowIgnore[prop-missing] issue_type exists if issue is not chronic
                issue.issue_type,
          group: issueGroup.group,
        })
    )
  );

  return issuesGrouped;
};
